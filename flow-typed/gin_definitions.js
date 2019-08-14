declare var THELPER_MODEL_UPLOAD_INSTRUCTIONS: string;
declare var GRAPHQL_ENDPOINT: string;
declare var ML_ENDPOINT: string;
declare var MAGPIE_ENDPOINT: string;
declare var GEOIMAGENET_API_URL: string;
declare var GEOSERVER_URL: string;
declare var FRONTEND_JS_SENTRY_DSN: string;
declare var ANNOTATION_LAYER: string;
declare var ANNOTATION_NAMESPACE: string;

declare module './img/icons/favicon.ico' {}
declare module 'react-notifications/lib/notifications.css' {}

declare type Counts = {
    'new': number,
    'pre_released': number,
    'released': number,
    'rejected': number,
    'validated': number,
    'deleted': number,
};

declare type Version_API = {
    root_taxonomy_class_id: number,
    taxonomy_id: number,
    version: string,
};
