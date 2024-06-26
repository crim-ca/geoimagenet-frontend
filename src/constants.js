// @flow strict
/**
 * We need a bing api key for the aerial base maps to be displayed.
 * @todo copied from other CRIM projects, at some point we need something that is not subject to stop working randomly.
 * @type {string}
 */

export const BING_API_KEY = 'AtXX65CBBfZXBxm6oMyf_5idMAMI7W6a5GuZ5acVcrYi6lCQayiiBz7_aMHB7JR7';

export const CUSTOM_GEOIM_IMAGE_LAYER = 'custom_geiom_image_layer';

export const Z_INDEX = {
  BASEMAP: -10,
};

export const VALID_OPENLAYERS_ANNOTATION_RESOLUTION = 10;

/**
 * These modes control what can be done in the platform.
 * Each of them must be selected before its actions can be made by a user.
 *
 * @type {Object} MODE
 * @property {String} VISUALIZATION Visualize, or more generally navigate through the map and images.
 * @property {String} DUPLICATION Not yet implemented.
 * @property {String} CREATION Create new annotations, after choosing a class.
 * @property {String} MODIFICATION Modify existing annotations, only before being released (status = NEW)
 * @property {String} DELETION Delete one's own annotation that has not been released yet.
 * @property {String} ASK_EXPERTISE Not yet implemented.
 * @property {String} VALIDATION Admin only, allows to validate that an annotation is valid.
 * @property {String} RELEASE allows the user to release their annotations
 */
export const MODE = {
  VISUALIZATION: 'VISUALIZE',
  DUPLICATION: 'DUPLICATE',
  CREATION: 'CREATION',
  MODIFICATION: 'MODIFY',
  DELETION: 'DELETE',
  ASK_EXPERTISE: 'ASK_EXPERTISE',
  VALIDATION: 'VALIDATE',
  RELEASE: 'RELEASE',
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
  {
    title: 'Aerial with labels',
    imagerySet: 'AerialWithLabels',
    visible: false,
  },
  {
    title: 'Aerial',
    imagerySet: 'Aerial',
    visible: true,
  },
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

export const ADMIN_GROUP = 'administrators';

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

/**
 * used in string concatenation for material-ui styling and geoserver requests so we don't use an integer here
 */
export const ANNOTATION_THUMBNAIL_SIZE: string = '75';
