import {TaxonomyBrowser} from '/js/TaxonomyBrowser.js';
import {MapManager} from '/js/MapManager.js';
import {build_actions} from '/js/Actions.js';

mobx.configure({
    enforceActions: 'always',
});

addEventListener('DOMContentLoaded', () => {
    const map_manager = new MapManager(
        SERVER_PROTOCOL,
        GEOSERVER_URL,
        GEOIMAGENET_API_URL,
        ANNOTATION_NAMESPACE_URI,
        ANNOTATION_NAMESPACE,
        ANNOTATION_LAYER,
        'map'
    );
    new TaxonomyBrowser(map_manager);
    build_actions();
});
