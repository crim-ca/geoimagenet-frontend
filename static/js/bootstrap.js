import {TaxonomyBrowser} from './TaxonomyBrowser.js';
import {MapManager} from './MapManager.js';
import {build_actions} from './Actions.js';
import {register_section_handles} from './utils/sections.js';

// this is relatively important in the sense that it constraints us to mutate the store only in actions
// otherwise, changing the store, affecting the state wach time, can be compared to an open heart hemorrhage
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
    register_section_handles('section-handle');
});
