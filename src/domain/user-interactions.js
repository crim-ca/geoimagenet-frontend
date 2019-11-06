// @flow strict

import { DialogManager } from '../components/Dialogs';
import { action } from 'mobx';
import { InvalidPermissions, ProbablyInvalidPermissions, ResourcePermissionRepository, User } from './entities.js';
import { AccessControlList } from './access-control-list.js';
import { NotificationManager } from 'react-notifications';

import { ANNOTATION, ANNOTATION_STATUS_AS_ARRAY } from '../constants';
import { captureException } from '@sentry/browser';

import { i18n } from '../utils';

import type { DataQueries } from './data-queries';
import type { StoreActions } from '../model/StoreActions';
import type { GeoImageNetStore } from '../model/GeoImageNetStore';
import type { Feature, ModifyEvent } from 'ol';
import type { SatelliteImage, Taxonomy } from './entities';
import type { Map } from 'ol/Map';
import type { Event } from 'ol/events';
import type { GeoJSON, WKT } from 'ol/format';
import type { FollowedUser, MagpieMergedSessionInformation, TaxonomyClassesDataFromAPI } from '../Types';
import type { TaxonomyStore } from '../model/TaxonomyStore';

const { t } = i18n;


/**
 * In a web app, we need top level handlers that react to specific user intentions, and interactions.
 * These are not event handlers per se, they should receive everything needed to execute everything intended by the user,
 * from confirmation to store alterations.
 *
 * However, it starts to be apparent (with the latest remove_followed_users and others handlers) that possibly this layer is
 * a superfluous proxy between presentation and data queries. Both user_interaction and dataQueries represent the Data Access Layer.
 * They could be the same, as the added responsibility of "error handling" (notifications to the user) could be actually done
 * in the presentation. Which is possibly more relevant.
 *
 * In some cases an actual "data modification" needs multiples data queries to be made in succession, which I've tried to avoid in the
 * data queries, but I now feel this separation is artificial. All of that concerns the data access layer, and it could be made from the
 * same entity/layer, instead of the current separation between UserInteractions and DataQueries
 */

export class UserInteractions {

  storeActions: StoreActions;

  taxonomyStore: TaxonomyStore;

  dataQueries: DataQueries;

  i18next_instance: i18n;

  geoImageNetStore: GeoImageNetStore;

  /**
   * @TODO move the original coordinates in the store, possibly a store specific to open layers
   */
  original_coordinates: {} = {};

  /**
   *
   * The user interactions have first-hand influence upon the application state,
   * we need the store actions as dependency
   */
  constructor(storeActions: StoreActions, taxonomyStore: TaxonomyStore, dataQueries: DataQueries, i18next_instance: i18n, geoImageNetStore: GeoImageNetStore) {
    this.storeActions = storeActions;
    this.dataQueries = dataQueries;
    this.i18next_instance = i18next_instance;
    this.geoImageNetStore = geoImageNetStore;
    this.taxonomyStore = taxonomyStore;

    this.release_annotations = this.release_annotations.bind(this);
  }

  refresh_all_sources = () => {
    ANNOTATION_STATUS_AS_ARRAY.forEach(status => this.refresh_source_by_status(status));
  };

  /**
   * Some actions need to redraw the annotations on the viewport. This method clears then refreshes the features on the specified layer.
   */
  refresh_source_by_status = (status: string) => {
    if (this.geoImageNetStore.annotations_sources[status]) {
      this.geoImageNetStore.annotations_sources[status].clear();
      this.geoImageNetStore.annotations_sources[status].refresh(true);
    }
  };

  switch_features_from_source_to_source(features: Array<Feature>, old_source: string, new_source: string) {
    /**
     * while it would seem tempting to move the features all at once and change the count with the features.length,
     * the taxonomy class id changes for each feature, so we need to loop over the collection to know it anyway
     * we could aggregate the counts then call the changes after the loop, maybe reducing the function calls,
     * but there's no guarantee that the collection is not of all different classes, nor that it'd be any faster
     */
    features.forEach(feature => {
      const taxonomy_class_id = feature.get('taxonomy_class_id');
      this.geoImageNetStore.annotations_sources[old_source].removeFeature(feature);
      this.geoImageNetStore.annotations_sources[new_source].addFeature(feature);
      this.storeActions.change_annotation_status_count(taxonomy_class_id, old_source, -1);
      this.storeActions.change_annotation_status_count(taxonomy_class_id, new_source, 1);
    });
  }

  delete_annotation_under_click = async (features: Array<Feature>, feature_ids: Array<number>) => {
    try {
      await DialogManager.confirm(`Do you really want to delete the highlighted feature?`);
    } catch (e) {
      // if we catched it means user did not want to delete the annotation, simply return, nothing problematic here.
      return;
    }
    try {
      await this.dataQueries.delete_annotations_request(feature_ids);
      this.switch_features_from_source_to_source(features, ANNOTATION.STATUS.NEW, ANNOTATION.STATUS.DELETED);
    } catch (error) {
      const json = await error.json();
      NotificationManager.error(json.detail);
      captureException(error);
    }
  };

  validate_features_under_click = async (features: Array<Feature>, feature_ids: Array<number>) => {
    try {
      await this.dataQueries.validate_annotations_request(feature_ids);
      this.switch_features_from_source_to_source(features, ANNOTATION.STATUS.RELEASED, ANNOTATION.STATUS.VALIDATED);
    } catch (error) {
      const json = await error.json();
      NotificationManager.error(json.detail);
      captureException(error);
    }
  };

  reject_features_under_click = async (features: Array<Feature>, feature_ids: Array<number>) => {
    try {
      await this.dataQueries.reject_annotations_request(feature_ids);
      this.switch_features_from_source_to_source(features, ANNOTATION.STATUS.RELEASED, ANNOTATION.STATUS.REJECTED);
    } catch (error) {
      const json = await error.json();
      NotificationManager.error(json.detail);
      captureException(error);
    }
  };

  validate_creation_event_has_features = async () => {
    if (this.taxonomyStore.selected_taxonomy_class_id === -1) {
      NotificationManager.warning('You must select a taxonomy class to begin annotating content.');
    }
  };

  /**
   * Launch the creation of a new annotation. This should also update the "new" annotations count of the relevant
   * taxonomy class.
   */
  create_drawend_handler = (format_geojson: GeoJSON, wkt_format: WKT, annotation_layer: string) => async (event: Event) => {
    const { feature }: { feature: Feature } = event;
    const { selected_taxonomy_class_id } = this.geoImageNetStore;

    const feature_wkt = wkt_format.writeFeature(feature);
    const json = await this.dataQueries.get_annotation_images(feature_wkt);

    let image_title = this.geoImageNetStore.current_annotation.image_title;
    const image_feature = json.features.filter(f => f.properties.layer_name === image_title)
      .pop();

    if (image_feature === undefined) {
      NotificationManager.warning('The annotation must be entirely located on an image.');
      event.preventDefault();
    } else {
      feature.setProperties({
        taxonomy_class_id: selected_taxonomy_class_id,
        image_id: image_feature.properties.id,
      });
      const payload = format_geojson.writeFeature(feature);
      try {
        const [new_feature_id] = await this.dataQueries.create_geojson_feature(payload);
        feature.setId(`${annotation_layer}.${new_feature_id}`);
        if (this.geoImageNetStore.logged_user) {
          feature.set('annotator_id', this.geoImageNetStore.logged_user.id);
        }
        this.storeActions.change_annotation_status_count(this.geoImageNetStore.selected_taxonomy_class_id, ANNOTATION.STATUS.NEW, 1);
        this.storeActions.invert_taxonomy_class_visibility(this.geoImageNetStore.flat_taxonomy_classes[selected_taxonomy_class_id], true);
      } catch (error) {
        NotificationManager.error(error.message);
      }
    }

    this.storeActions.end_annotation();
  };

  save_followed_user = async (form_data: FollowedUser): Promise<void> => {
    await this.dataQueries.save_followed_user([form_data]);
    this.storeActions.add_followed_user(form_data);
  };

  get_followed_users_collection = (): Promise<FollowedUser[]> => {
    return new Promise((resolve, reject) => {
      this.dataQueries.fetch_followed_users()
        .then(
          response => resolve(response),
          error => {
            captureException(error);
            NotificationManager.error(t('settings.fetch_followed_users_failure'));
            reject(error);
          },
        );
    });
  };

  remove_followed_user = async (id: number): Promise<void> => {
    await this.dataQueries.remove_followed_user(id);
    this.storeActions.remove_followed_user(id);
  };

  populate_image_dictionary = async () => {
    const images_dictionary = await this.dataQueries.fetch_images_dictionary();
    this.storeActions.set_images_dictionary(images_dictionary);
  };

  /**
   * here we validate that a feature is completely over the same image
   * for every point in the geometry
   *   for every layer under the point
   *     reject the modification if the layer does not correspond to either image name of the image id
   */
  feature_respects_its_original_image = async (feature: Feature, wkt_format: WKT) => {
    const image_id = feature.get('image_id');
    const feature_wkt = wkt_format.writeFeature(feature);

    const this_satellite_image: SatelliteImage | typeof undefined = this.geoImageNetStore.images_dictionary.find(image => {
      return image.id === image_id;
    });
    if (this_satellite_image === undefined) {
      NotificationManager.error('The image you are trying to annotate does not seem to be referenced by the aip. ' +
        'You may try to reload the platform but this seem to be an internal error, you may want to contact ' +
        'your platform administrator.');
      return false;
    }

    const json = await this.dataQueries.get_annotation_images(feature_wkt);
    return json.features.some(f => f.properties.id === image_id);
  };

  modifystart_handler = (event: Event) => {
    event.features.forEach(feature => {
      this.original_coordinates[feature.getId()] = feature.getGeometry()
        .getCoordinates();
    });
  };

  /**
   * Create an event handler that OL will call when a modification is done
   *
   * the handler, when called, should verify that the geometry is over the same image as it was before.
   */
  create_modifyend_handler = (format_geojson: GeoJSON, format_wkt: WKT, map: Map) => async (event: ModifyEvent) => {
    const all_modified_features = [];
    const modified_features_to_update = [];
    const modified_features_to_reset = [];

    event.features.forEach((feature) => {
      if (feature.revision_ >= 1) {
        all_modified_features.push(feature);
      }
    });

    await Promise.all(all_modified_features.map(async (feature: Feature) => {
      let valid = await this.feature_respects_its_original_image(feature, format_wkt, map);
      if (!valid) {
        modified_features_to_reset.push(feature);
      } else {
        modified_features_to_update.push(feature);
      }
    }));

    const reset_feature = feature => {
      // feature is not ok, reset it and remove it from the modified features
      feature.getGeometry()
        .setCoordinates(this.original_coordinates[feature.getId()]);
    };

    if (modified_features_to_reset.length > 0) {
      modified_features_to_reset.forEach((feature) => {
        reset_feature(feature);
      });
      NotificationManager.warning('An annotation must be wholly contained in a single image, ' +
        'you are trying to make a coordinate go outside of the original image.');
    }

    if (modified_features_to_update.length > 0) {
      const payload = format_geojson.writeFeatures(modified_features_to_update);
      try {
        await this.dataQueries.modify_geojson_features(payload);
      } catch (error) {
        modified_features_to_update.forEach(reset_feature);
        NotificationManager.error(error.message);
      }
    }

    // reset modification status
    all_modified_features.forEach(feature => {
      feature.revision_ = 0;
      delete this.original_coordinates[feature.getId()];
    });
  };

  ask_expertise_for_features = async (feature_ids: number[], features: Feature[]) => {
    try {
      await this.dataQueries.review_request(feature_ids, true);
      features.forEach(feature => {
        feature.set('review_requested', true);
      });
      NotificationManager.success('Features were marked for expertise.');
    } catch (error) {
      captureException(error);
      NotificationManager.error(error.message);
    }
  };

  start_annotation(image_title: string) {
    this.storeActions.set_current_annotation_image_title(image_title);
  }

  logout = async () => {
    try {
      await this.dataQueries.logout_request();
      window.location = '/';
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * When fetching taxonomies, we need to
   *  - actually fetch the taxonomies
   *  - fetch the taxonomy classes
   *  - build default values for each taxonomy class element (such as the checked, for visibility selection, or opened, for tree navigation)
   *  - build the localized versions strings in the i18n framework (ideally only if theye not already present)
   *
   * @returns {Promise<void>}
   */
  @action.bound
  async fetch_taxonomies() {

    try {
      const taxonomies = await this.dataQueries.fetch_taxonomies();
      this.storeActions.set_taxonomy(taxonomies);
      const root_taxonomy_classes: TaxonomyClassesDataFromAPI = await this.dataQueries.fetch_taxonomy_classes();
      /**
       * the build_taxonomy_classes_structure has the nice side-effect of building a flat taxonomy classes structure as well!
       * so we will neatly ask it to generate language dictionaries for newly added taxonomy classes afterwards
       */
      root_taxonomy_classes.forEach(root_taxonomy_class => this.storeActions.build_taxonomy_classes_structures(root_taxonomy_class));

      const fr_dict = this.storeActions.generate_localized_taxonomy_classes_labels('fr');
      const en_dict = this.storeActions.generate_localized_taxonomy_classes_labels('en');

      this.i18next_instance.addResources('fr', 'taxonomy_classes', fr_dict);
      this.i18next_instance.addResources('en', 'taxonomy_classes', en_dict);

    } catch (e) {
      switch (e.status) {
        case 404:
          NotificationManager.warning('There doesn\'t seem to be any taxonomy available in the API (we received a 404 not-found status). ' +
            'This will likely render the platform unusable until someone populates the taxonomies.');
          break;
        default:
          NotificationManager.error('We could not fetch the taxonomies. This will heavily and negatively impact the platform use.');
      }
    }
  }

  /**
   * When the user selects a taxonomy, we decide to refresh the annotation counts, as they can change more often than the classes themselves.
   */
  @action.bound
  async select_taxonomy(taxonomy: Taxonomy) {
    this.storeActions.set_selected_taxonomy(taxonomy);
    try {
      const counts = await this.dataQueries.flat_taxonomy_classes_counts(this.geoImageNetStore.root_taxonomy_class_id);
      this.storeActions.set_annotation_counts(counts);
      const taxonomy_class = this.taxonomyStore.flat_taxonomy_classes[this.geoImageNetStore.root_taxonomy_class_id];
      this.taxonomyStore.toggle_taxonomy_class_tree_element(taxonomy_class, true);
    } catch (e) {
      NotificationManager.error('We were unable to fetch the taxonomy classes.');
    }
  }

  /**
   * Should be called anytime there is a change to the user's session, either login or logout.
   * @todo at some point unhardcode the frontend parameter here, maybe get it from environment variable
   * @returns {Promise<void>}
   */
  refresh_user_resources_permissions = async () => {
    /**
     *
     * @type {Object}
     */
    const magpie_session_json: MagpieMergedSessionInformation = await this.dataQueries.current_user_session();
    const { user, authenticated } = magpie_session_json;
    let followed_users: FollowedUser[];
    try {
      followed_users = await this.get_followed_users_collection();
    } catch (error) {
      followed_users = [];
    }
    const user_instance = new User(user.user_name, user.email, user.group_names, user.user_id, followed_users);
    this.storeActions.set_session_user(user_instance);
    let json_response;
    try {
      json_response = await this.dataQueries.current_user_permissions('frontend');
    } catch (e) {
      if (e.status === 404) {
        NotificationManager.error('Permissions for the frontend service do not seem to be properly configured. ' +
          'That will probably prevent you from using the platform, please contact your administrator.');
        return;
      }
      throw e;
    }

    if (!json_response.service && !json_response.service.resources) {
      NotificationManager.error('The permissions structure returned from Magpie does not seem properly formed: ' +
        'there is no resource attribute on it.');
      throw new InvalidPermissions();
    }
    const { service } = json_response;
    const { resources } = service;
    let resource_permission_repository;
    try {
      resource_permission_repository = new ResourcePermissionRepository(resources);
    } catch (e) {
      if (e instanceof ProbablyInvalidPermissions) {
        NotificationManager.warning('It seems that permissions for your user are either incorrectly set, ' +
          'or undefined. This is probably not something you can solve on your own, please contact ' +
          'your administrator if this prevents you from using the platform.');
        return;
      }
      throw e;
    }
    const acl = new AccessControlList(resource_permission_repository, authenticated);
    this.storeActions.set_acl(acl);

  };

  /**
   * - Release annotations for the selected class
   * - Update counts for relevant annotations
   * - Update features in relevant layers
   */
  release_annotations = async (taxonomy_class_id: number) => {
    await DialogManager.confirm('Do you really want to release all the annotations of the selected class, as well as its children?');
    try {
      await this.dataQueries.release_annotations_request(taxonomy_class_id);
      const counts = await this.dataQueries.flat_taxonomy_classes_counts(taxonomy_class_id);
      this.storeActions.set_annotation_counts(counts);
      NotificationManager.success('Annotations were released.');
    } catch (error) {
      captureException(error);
      NotificationManager.error('We were unable to release the annotations.');
    }
  };

  /**
   * When submitting the login form, the user expects to login, or be presented with error about said login.
   * Send the credentials to magpie, then verify content to be sure user is logged in, then notify about successful login.
   * In case of error, notify of problem without leaking too much detail.
   */
  async login_form_submission(form_data: {}) {
    try {
      await this.dataQueries.login_request(form_data);
      window.location.href = '/platform';
    } catch (error) {
      NotificationManager.error(this.i18next_instance.t('login:forbidden'));
    }
  }

}
