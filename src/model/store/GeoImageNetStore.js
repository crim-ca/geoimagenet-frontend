// @flow strict
import { typeof Collection } from 'ol';
import {
  observable,
  computed,
  action,
  configure,
} from 'mobx';
import typeof VectorLayer from 'ol/layer/Vector';
import typeof VectorSource from 'ol/source/Vector';
import { SatelliteImage } from '../entity/SatelliteImage';
import { ResourcePermissionRepository } from '../ResourcePermissionRepository';
import { User } from '../User';
import { Taxonomy } from '../entity/Taxonomy';
import type { FollowedUser } from '../../Types';
import { MODE } from '../../constants';
import { AccessControlList } from '../../domain/access-control-list';

/**
 * this is relatively important in the sense that it constraints us to mutate the store only in actions
 * otherwise, changing the store, affecting the state each time, can be compared to an open heart hemorrhage
 */
configure({
  enforceActions: 'always',
});

/**
 * The application state must, at each given time, fully represent what a user is seeing.
 * This is the central piece of information of the application, the single most important object that defines its state.
 * All rendering components must tie to its properties, and rerender themselves according to it.
 * We use MobX ties to react through the observer construct (the @observer) decorator present on react components.
 */
export class GeoImageNetStore {
  /**
   * Labels can be overwhelming when there are too much objects on the screen,
   * this property should allow user to show them or not.
   */
  @observable showLabels: boolean = true;

  @action toggleLabels: (?boolean) => void = (override: ?boolean) => {
    if (override !== undefined && override !== null) {
      this.showLabels = override;
      return;
    }
    this.showLabels = !this.showLabels;
  };

  @observable showAnnotatorsIdentifiers: boolean = true;

  @action toggleAnnotationOwners: (?boolean) => void = (override: ?boolean) => {
    if (override !== undefined && override !== null) {
      this.showAnnotatorsIdentifiers = override;
      return;
    }
    this.showAnnotatorsIdentifiers = !this.showAnnotatorsIdentifiers;
  };

  /**
   * When loading the platform, we by default put the user in a state of visualization.
   * @type {String}
   */
  @observable mode: string = MODE.VISUALIZATION;

  /**
   * An user is able to act on the annotations based on wether or not they are at a suitable zoom level.
   * @todo make this a computed mobx value
   * @type {boolean}
   */
  @observable actions_activated: boolean = false;

  @observable acl: AccessControlList = new AccessControlList(new ResourcePermissionRepository());

  @observable taxonomies: Taxonomy[] = [];

  @computed get root_taxonomy_class_id(): number {
    if (this.selected_taxonomy === null || this.selected_taxonomy === undefined) {
      return -1;
    }
    if (this.selected_taxonomy.versions === undefined) {
      return -1;
    }
    return this.selected_taxonomy.versions[0].root_taxonomy_class_id || -1;
  }

  @observable imagesDictionary: SatelliteImage[];

  @observable selected_taxonomy: Taxonomy | null = null;

  /**
   * For the next three properties, we directly write the indexes because flojs does not support the use of the constants
   * as keys. If that changes in the future maybe change it.
   */

  /**
   * The Open Layers collections currently used in the map.
   */
  @observable annotations_collections: {
    'new': Collection,
    'pre_released': Collection,
    'released': Collection,
    'validated': Collection,
    'rejected': Collection,
    'deleted': Collection,
  } = {};

  /**
   * The Open Layers sources currently used in the map.
   */
  @observable annotations_sources: {
    'new': VectorSource,
    'pre_released': VectorSource,
    'released': VectorSource,
    'validated': VectorSource,
    'rejected': VectorSource,
    'deleted': VectorSource,
  } = {};

  /**
   * The Open Layers layers currently used in the map.
   * We directly write
   */
  @observable annotations_layers: {
    'new': VectorLayer,
    'pre_released': VectorLayer,
    'released': VectorLayer,
    'validated': VectorLayer,
    'rejected': VectorLayer,
    'deleted': VectorLayer,
  } = {};

  /**
   * An instance with the current user's information.
   */
  @observable user: User;

  /**
   * We need to be able to control how annotations are created.
   * Once we begin adding points, we limit the adding of points
   * that are outside of an image, or on another image (maybe). This represents an ongoing annotation.
   */
  @observable current_annotation = {
    initialized: false,
    image_title: '',
  };
}
