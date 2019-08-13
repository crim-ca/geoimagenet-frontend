/**
 * We need a bing api key for the aerial base maps to be displayed.
 * @todo this was copied from other CRIM projects, at some point we need to actually have something that is not subject to stop working randomly.
 * @type {string}
 */
import {AnnotationStatus} from './entities.js';

export const BING_API_KEY = 'AtXX65CBBfZXBxm6oMyf_5idMAMI7W6a5GuZ5acVcrYi6lCQayiiBz7_aMHB7JR7';

export const CUSTOM_GEOIM_IMAGE_LAYER = 'custom_geiom_image_layer';

/**
 * General configuration value of the notifications. Maybe get that from environment at some point?
 * @type {number}
 */
export const NOTIFICATION_LIFE_SPAN_MS = 10000;

export const Z_INDEX = {
    BASEMAP: -10,
};

export const VALID_OPENLAYERS_ANNOTATION_RESOLUTION = 20;

/**
 * These modes control what can be done in the platform. Each of them must be selected before its actions can be made by a user.
 * @type {Object} MODE
 * @property {String} VISUALIZE Visualize, or more generally navigate through the map and images.
 * @property {String} DUPLICATE Not yet implemented.
 * @property {String} CREATION Create new annotations, after choosing a class.
 * @property {String} MODIFY Modify existing annotations, only before being released (status = NEW)
 * @property {String} DELETE Delete one's own annotation that has not been released yet.
 * @property {String} ASK_EXPERTISE Not yet implemented.
 * @property {String} VALIDATE Admin only, allows to validate that an annotation is valid.
 * @property {String} REJECT Admin only, allows to reject an annotation so it doesn't get in the patches.
 */
export const MODE = {
    VISUALIZE: 'VISUALIZE',
    DUPLICATE: 'DUPLICATE',
    CREATION: 'CREATION',
    MODIFY: 'MODIFY',
    DELETE: 'DELETE',
    ASK_EXPERTISE: 'ASK_EXPERTISE',
    VALIDATE: 'VALIDATE',
    REJECT: 'REJECT',
};

/**
 * These represent the status an annotation can have and MUST be kept manually in sync with the status in the API.
 * @type {Object}
 */
export const ANNOTATION = {
    STATUS: {
        NEW: 'new',
        PRE_RELEASED: 'pre_released',
        RELEASED: 'released',
        VALIDATED: 'validated',
        REJECTED: 'rejected',
        DELETED: 'deleted',
    }
};

export const ANNOTATION_STATUS_AS_ARRAY = [
    'new',
    'pre_released',
    'released',
    'validated',
    'rejected',
    'deleted',
];

export const ALLOWED_BING_MAPS = [
    {title: 'Aerial with labels', imagerySet: 'AerialWithLabels', visible: false},
    {title: 'Aerial', imagerySet: 'Aerial', visible: true},
];

/**
 * The default view used by the application, this represents a center around Canada.
 * @type {Object}
 * @property {Number[]} CENTRE The coordinates for the center of the viewport.
 * @property {Number} ZOOM_LEVEL
 */
export const VIEW_CENTER = {
    CENTRE: [-95, 57],
    ZOOM_LEVEL: 4,
};

/**
 * Magpie permission name for get access
 * @type {string}
 */
export const READ = 'read';

/**
 * Magpie permission name for put, post, editing access
 * @type {string}
 */
export const WRITE = 'write';


/**
 * Magpie resource for datasets sections and interactions
 * @type {string}
 */
export const DATASETS = 'datasets';

/**
 * Magpie resource for annotations sections and interactions
 * @type {string}
 */
export const ANNOTATIONS = 'annotations';

/**
 * Magpie resource for annotation validation sections and interactions
 * @type {string}
 */
export const VALIDATIONS = 'validations';

/**
 * Magpie resource for reading the wms copyright protected images.
 * @type {string}
 */
export const WMS = 'wms';
