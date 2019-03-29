import {MODE, VISIBLE_LAYERS_BY_DEFAULT} from '../domain/constants.js';
import {AccessControlList} from '../domain/access-control-list.js';
import {ResourcePermissionRepository} from '../domain/entities.js';

/**
 * The application state must, at each given time, fully represent what a user is seeing.
 * This is the central piece of information of the application, the single most important object that defines its state.
 * All rendering components must tie to its properties, and rerender themselves according to it. We use MobX ties to react
 * through the observer construct (the @observer) decorator present on react components.
 */
export class GeoImageNetStore {

    /**
     * The visible annotations types should federate every part of the platform that manages annotations, from the counts
     * in the classes hierarchies to the visible annotations on the map, and every future annotations interactions.
     * @type {String[]}
     */
    visible_annotations_types = VISIBLE_LAYERS_BY_DEFAULT;

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

    selected_taxonomy = {
        id: 0,
        name: '',
        version: 0,
        elements: [],
        root_taxonomy_class_id: 0,
    };

    /**
     * The flat taxonomy classes structure simplifies the acces to classes when we need to change one directly, without looping
     * over the whole taxnomy structure to find the one we want.
     * @type {Object<Number, TaxonomyClass>}
     */
    flat_taxonomy_classes = {};

    selected_taxonomy_class_id = -1;
    visible_classes = [];

    /**
     * The Open Layers collections currently used in the map.
     * @type {Object}
     */
    annotations_collections = {};

    /**
     * The Open Layers sources currently used in the map.
     * @type {Object}
     */
    annotations_sources = {};

    /**
     * The Open Layers layers currently used in the map.
     * @type {Object}
     */
    annotations_layers = {};

    /**
     * An instance with the current user's information.
     * @type {User|null}
     */
    logged_user = null;

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
