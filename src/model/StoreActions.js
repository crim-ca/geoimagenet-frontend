// @flow strict

import type { Collection } from 'ol';
import type { Source } from 'ol/source';
import type { Vector } from 'ol/layer';
import { observable, action } from 'mobx';
import { TaxonomyClass } from './TaxonomyClass';
import { MODE } from '../constants';
import type { AccessControlList } from '../domain/access-control-list';
import type { SatelliteImage } from './entity/SatelliteImage';
import type { User } from './User';
import type { Taxonomy } from './entity/Taxonomy';
import type { GeoImageNetStore } from './store/GeoImageNetStore';
import type { TaxonomyClassFromAPI, AnnotationStatus, FollowedUser } from '../Types';
import type { TaxonomyStore } from './store/TaxonomyStore';
import { UserInterfaceStore } from './store/UserInterfaceStore';
import { ANNOTATION } from '../Types';

/**
 * The store actions are lower level action handlers, in the sense that they are not directly related to a user's actions,
 * but rather are used strictly to update the state of the application, upon which the ui will depend.
 */

type AnnotationCounts = {
  NEW: number,
  PRE_RELEASED: number,
  RELEASED: number,
  REVIEW: number,
  VALIDATED: number,
  REJECTED: number,
  DELETED: number,
};

export class StoreActions {
  geoImageNetStore: GeoImageNetStore;

  uiStore: UserInterfaceStore;

  taxonomyStore: TaxonomyStore;

  /**
   * We use MobX as our state manager, hence our store is the primary dependency of our store actions.
   */
  constructor(geoImageNetStore: GeoImageNetStore, taxonomyStore: TaxonomyStore, uiStore: UserInterfaceStore) {
    this.geoImageNetStore = geoImageNetStore;
    this.taxonomyStore = taxonomyStore;
    this.uiStore = uiStore;
  }

  @action.bound
  toggle_show_labels() {
    this.geoImageNetStore.showLabels = !this.geoImageNetStore.showLabels;
  }

  /**
   * When user adds an annotation status to the visibility pool, we need to update the store.
   */
  @action.bound
  toggle_annotation_status_visibility(annotationStatusText: AnnotationStatus, overrideActivated: boolean | null = null) {
    if (!(annotationStatusText in this.uiStore.annotationStatusFilters)) {
      throw new TypeError(`Invalid annotation status: [${annotationStatusText}]`);
    }
    const annotationFilter = this.uiStore.annotationStatusFilters[annotationStatusText];
    if (overrideActivated !== null) {
      annotationFilter.toggleActivated(overrideActivated);
    } else {
      annotationFilter.toggleActivated();
    }
    this.set_annotation_layer_visibility(annotationStatusText, annotationFilter.activated);
  }

  /**
   * The ownership filters differ from the status filters in that they don't remove any actual feature layer, they
   * simply filter the annotations in said layer, based on a user id condition.
   */
  @action.bound
  toggle_annotation_ownership_filter(annotationOwnership: string, overrideActivated: boolean | null = null) {
    if (!(annotationOwnership in this.uiStore.annotationOwnershipFilters)) {
      throw new TypeError(`Invalid annotation ownership: [${annotationOwnership}]`);
    }
    const annotationFilter = this.uiStore.annotationOwnershipFilters[annotationOwnership];
    if (overrideActivated !== null) {
      annotationFilter.toggleActivated(overrideActivated);
    } else {
      annotationFilter.toggleActivated();
    }
  }

  @action.bound
  set_session_user(user: User) {
    this.geoImageNetStore.user = user;
  }

  /**
   * We want to extract all localized taxonomy classes strings and send them in a dictionary that makes ids correspond to names.
   * Later on, we'll use i18next to translate the strings.
   */
  @action.bound
  generate_localized_taxonomy_classes_labels(lang: string) {
    const { flat_taxonomy_classes } = this.taxonomyStore;
    const dict = {};
    for (const taxonomy_class_id in flat_taxonomy_classes) {
      if (flat_taxonomy_classes.hasOwnProperty(taxonomy_class_id)) {
        const taxonomy_class = flat_taxonomy_classes[taxonomy_class_id];
        const name_tag = `name_${lang}`;
        if (taxonomy_class.hasOwnProperty(name_tag)) {
          dict[taxonomy_class.id] = taxonomy_class[name_tag];
        }
      }

    }
    return dict;
  }

  /**
   * Take the raw data structure from the api and transform it into usable structures for the UI.
   *
   * loop over an object, build a class instance from it.
   * assign the class instance to its index in the flat taxonomy list
   * if we have a parent id, add the instance to the children of said parent id in the flat list
   * iw we have children, recursive call to this function for each children
   *
   */
  @action.bound
  build_taxonomy_classes_structures(taxonomy_class_from_api: TaxonomyClassFromAPI) {

    const assign_top_object_to_list = (object, parent_id = null) => {
      const current_raw = object;

      /**
       * Not quite completely sure why and how the observable.object is needed here.
       * I think it's because mobx does not observe too deeply nested object's properties.
       * @type {TaxonomyClass & IObservableObject}
       */
      const current_instance = observable.object(new TaxonomyClass(
        current_raw.id,
        current_raw.name_fr,
        current_raw.name_en,
        current_raw.taxonomy_id
      ));
      this.taxonomyStore.flat_taxonomy_classes[current_instance.id] = current_instance;

      if (parent_id !== null) {
        current_instance.parent_id = parent_id;
        this.taxonomyStore.flat_taxonomy_classes[parent_id].children.push(current_instance);
      }

      if (current_raw.children && current_raw.children.length > 0) {
        current_raw.children.forEach((c) => {
          assign_top_object_to_list(c, current_raw.id);
        });
      }
    };

    assign_top_object_to_list(taxonomy_class_from_api);

  }

  /**
   * When changing an annotation count, we need to go up the annotation tree and accomplish the same change.
   * Parent classes count all their children, so a change on a children must affect all parents.
   */
  @action.bound
  change_annotation_status_count(taxonomy_class_id: number, status: string, quantity: number) {

    if (!Number.isInteger(quantity) || quantity === 0) {
      throw new TypeError(`${quantity} is an invalid quantity argument to change annotation counts.`);
    }
    if (Object.values(ANNOTATION.STATUS)
      .indexOf(status) === -1) {
      throw new TypeError(`${status} is not a status that is supported by our platform.`);
    }
    if (!(taxonomy_class_id in this.taxonomyStore.flat_taxonomy_classes)) {
      throw new TypeError('Trying to change the counts of a non-existent taxonomy class.');
    }

    let instance = this.taxonomyStore.flat_taxonomy_classes[taxonomy_class_id];
    let { counts } = instance;
    /**
     * if we're under 0, we're decrementing, and the lowest possible value is 0.
     * otherwise, we might be adding to an undefined number, so default to 1 in that case
     *
     * since the quantity is under 0, we need to _add_ it to the count so that it is correctly substracted to the value
     */
    counts[status] = quantity < 0 ? Math.max(counts[status] + quantity, 0) : (counts[status] + quantity) || quantity;

    while (instance.parent_id !== null) {
      instance = this.taxonomyStore.flat_taxonomy_classes[instance.parent_id];
      ({ counts } = instance);
      counts[status] = quantity < 0 ? Math.max(counts[status] + quantity, 0) : (counts[status] + quantity) || quantity;
    }
  }

  @action.bound
  set_images_dictionary(imagesDictionary: SatelliteImage[]) {
    this.geoImageNetStore.imagesDictionary = imagesDictionary;
  }

  @action.bound
  set_current_annotation_image_title(image_title: string) {
    this.geoImageNetStore.current_annotation.initialized = true;
    this.geoImageNetStore.current_annotation.image_title = image_title;
  }

  @action.bound
  end_annotation() {
    this.geoImageNetStore.current_annotation.initialized = false;
    this.geoImageNetStore.current_annotation.image_title = '';
  }

  @action.bound
  set_annotation_counts(counts: AnnotationCounts) {
    for (let class_id in counts) {
      this.taxonomyStore.flat_taxonomy_classes[class_id].counts = counts[class_id];
    }
  }

  @action.bound
  set_annotation_collection(key: string, collection: Collection) {
    this.geoImageNetStore.annotations_collections[key] = collection;
  }

  @action.bound
  set_annotation_source(key: string, source: Source) {
    this.geoImageNetStore.annotations_sources[key] = source;
  }

  @action.bound
  set_annotation_layer(key: string, layer: Vector) {
    this.geoImageNetStore.annotations_layers[key] = layer;
  }

  /**
   * we have the annotation layers stored. When changing the visibility of a layer somehow, we should call this to set
   * the appropriate visibility on the layer.
   */
  @action.bound
  set_annotation_layer_visibility(key: string, visible: boolean) {
    this.uiStore.annotationStatusFilters[key].toggleActivated(visible);
  }

  @action.bound
  set_taxonomy(t: Taxonomy[]) {
    this.geoImageNetStore.taxonomies = t;
  }

  @action.bound
  set_selected_taxonomy(t: Taxonomy) {
    this.geoImageNetStore.selected_taxonomy = t;
  }

  @action.bound
  set_acl(acl: AccessControlList) {
    this.geoImageNetStore.acl = acl;
  }

  /**
   * Simply sets the current platform mode. Observed by other parts of the application.
   */
  @action.bound
  set_mode(mode: string) {
    if (Object.values(MODE)
      .indexOf(mode) > -1) {
      this.uiStore.selectedMode = mode;
    } else {
      throw Error(`The mode ${mode} is not a valid mode within this application`);
    }
  }

}
