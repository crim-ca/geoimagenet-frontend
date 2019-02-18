export const BING_API_KEY = 'AtXX65CBBfZXBxm6oMyf_5idMAMI7W6a5GuZ5acVcrYi6lCQayiiBz7_aMHB7JR7';
export const CUSTOM_GEOIM_IMAGE_LAYER = 'custom_geiom_image_layer';
export const NOTIFICATION_LIFE_SPAN_MS = 10000;

export const Z_INDEX = {
    BASEMAP: -10,
};

export const VALID_OPENLAYERS_ANNOTATION_RESOLUTION = 20;

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

export const ACTIONS = [
    {name: 'eye', icon_class: 'fa-eye', mode: MODE.VISUALIZE},
    {name: 'creation', icon_class: 'fa-plus-square', mode: MODE.CREATION},
    {name: 'duplicate', icon_class: 'fa-copy', mode: MODE.DUPLICATE},
    {name: 'modify', icon_class: 'fa-edit', mode: MODE.MODIFY},
    {name: 'delete', icon_class: 'fa-trash-alt', mode: MODE.DELETE},
    {name: 'ask_expertise', icon_class: 'fa-question-circle', mode: MODE.ASK_EXPERTISE},
    {name: 'validate', icon_class: 'fa-check', mode: MODE.VALIDATE},
    {name: 'refuse', icon_class: 'fa-times', mode: MODE.REJECT},
];

export const ANNOTATION = {
    STATUS: {
        NEW: 'new',
        PRE_RELEASED: 'pre_released',
        RELEASED: 'released',
        REVIEW: 'review',
        VALIDATED: 'validated',
        REJECTED: 'rejected',
        DELETED: 'deleted',
    }
};
export const ANNOTATION_STATUS_AS_ARRAY = [
    'new',
    'pre_released',
    'released',
    'review',
    'validated',
    'rejected',
    'deleted',
];
export const VISIBLE_LAYERS_BY_DEFAULT = [
    ANNOTATION.STATUS.NEW,
    ANNOTATION.STATUS.RELEASED,
    ANNOTATION.STATUS.REVIEW,
    ANNOTATION.STATUS.VALIDATED,
];

export const ALLOWED_BING_MAPS = [
    {title: 'Aerial with labels', imagerySet: 'AerialWithLabels', visible: false},
    {title: 'Aerial', imagerySet: 'Aerial', visible: true},
];

// view centered around this coordinates
export const VIEW_CENTER = {
     CENTRE: [-95, 57],
     ZOOM_LEVEL:  4,
};
