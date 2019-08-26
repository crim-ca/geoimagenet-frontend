// @flow strict
import {ANNOTATION, MODE} from '../domain/constants.js';
import {AccessControlList} from '../domain/access-control-list.js';
import {AnnotationStatusFilter, ResourcePermissionRepository} from '../domain/entities.js';
import {observable} from 'mobx';
import {Taxonomy, User} from "../domain/entities";
import typeof VectorLayer from "ol/layer/Vector.js";
import typeof VectorSource from "ol/source/Vector";
import {typeof Collection} from "ol";
import type {AnnotationStatusList} from "../Types";

/**
 * The application state must, at each given time, fully represent what a user is seeing.
 * This is the central piece of information of the application, the single most important object that defines its state.
 * All rendering components must tie to its properties, and rerender themselves according to it. We use MobX ties to react
 * through the observer construct (the @observer) decorator present on react components.
 */
export class GeoImageNetStore {
    /**
     * Labels can be overwhelming when there are too much objects on the screen, this property should allow user to show them or not.
     * @type {boolean}
     */
    show_labels = true;

    /**
     * The visible annotations types should federate every part of the platform that manages annotations, from the counts
     * in the classes hierarchies to the visible annotations on the map, and every future annotations interactions.
     */
    annotation_status_list: AnnotationStatusList = {
        [ANNOTATION.STATUS.NEW]: observable.object(new AnnotationStatusFilter(ANNOTATION.STATUS.NEW, true)),
        [ANNOTATION.STATUS.PRE_RELEASED]: observable.object(new AnnotationStatusFilter(ANNOTATION.STATUS.PRE_RELEASED)),
        [ANNOTATION.STATUS.RELEASED]: observable.object(new AnnotationStatusFilter(ANNOTATION.STATUS.RELEASED, true)),
        [ANNOTATION.STATUS.VALIDATED]: observable.object(new AnnotationStatusFilter(ANNOTATION.STATUS.VALIDATED, true)),
        [ANNOTATION.STATUS.REJECTED]: observable.object(new AnnotationStatusFilter(ANNOTATION.STATUS.REJECTED)),
        [ANNOTATION.STATUS.DELETED]: observable.object(new AnnotationStatusFilter(ANNOTATION.STATUS.DELETED)),
    };

    /**
     * When loading the platform, we by default put the user in a state of visualization.
     * @type {String}
     */
    mode = MODE.VISUALIZE;

    /**
     * An user is able to act on the annotations based on wether or not they are at a suitable zoom level.
     * @todo make this a computed mobx value
     * @type {boolean}
     */
    actions_activated = false;

    /**
     * @type {AccessControlList}
     */
    acl = new AccessControlList(new ResourcePermissionRepository());

    /**
     * @type {Taxonomy[]}
     */
    taxonomies = [];

    selected_taxonomy: Taxonomy | null = null;

    /**
     * The flat taxonomy classes structure simplifies the acces to classes when we need to change one directly, without looping
     * over the whole taxnomy structure to find the one we want.
     * @type {Object<Number, TaxonomyClass>}
     */
    flat_taxonomy_classes = {};

    selected_taxonomy_class_id = -1;
    visible_classes = [];

    /**
     * For the next three properties, we directly write the indexes because flojs does not support the use of the constants
     * as keys. If that changes in the future maybe change it.
     */

    /**
     * The Open Layers collections currently used in the map.
     */
    annotations_collections: {
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
    annotations_sources: {
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
    annotations_layers: {
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
    logged_user: User | null = null;

    /**
     * We need to be able to control how annotations are created. Once we begin adding points, we limit the adding of points
     * that are outside of an image, or on another image (maybe). This represents an ongoing annotation.
     * @type {Object}
     * @property {boolean} initialized Wether or not an annotation have started.
     * @property {String} image_title The image title that was associated with the first click.
     */
    current_annotation = {
        initialized: false,
        image_title: ''
    };
}
