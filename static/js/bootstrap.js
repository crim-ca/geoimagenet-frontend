import {TaxonomyBrowser} from './TaxonomyBrowser.js';
import {MapManager} from './MapManager.js';
import {build_actions} from './Actions.js';
import {register_section_handles} from './utils/sections.js';
import {get_by_id} from './utils/dom.js';
import {fetch_taxonomies} from './domain/data-queries.js';
import {set_taxonomy} from './domain/store.js';
import {notifier} from './utils/notifications.js';

// this is relatively important in the sense that it constraints us to mutate the store only in actions
// otherwise, changing the store, affecting the state each time, can be compared to an open heart hemorrhage
mobx.configure({
    enforceActions: 'always',
});

addEventListener('DOMContentLoaded', async () => {

    new MapManager(
        GEOSERVER_URL,
        ANNOTATION_NAMESPACE_URI,
        ANNOTATION_NAMESPACE,
        ANNOTATION_LAYER,
        'map'
    );
    new TaxonomyBrowser();

    try {
        const taxonomies = await fetch_taxonomies();
        set_taxonomy(taxonomies);
    } catch (e) {
        switch (e.status) {
            case 404:
                notifier.warning("There doesn't seem to be any taxonomy available in the API (we received a 404 not-found status). " +
                    "This will likely render the platform unusable until someone populates the taxonomies.");
                break;
            default:
                notifier.error('We could not fetch the taxonomies. This will heavily and negatively impact the platform use.');
        }
    }

    build_actions(get_by_id('actions'));
    register_section_handles('section-handle');
});
