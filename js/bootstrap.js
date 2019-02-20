import {TaxonomyBrowser} from './TaxonomyBrowser.js';
import {MapManager} from './MapManager.js';
import {register_section_handles} from './utils/sections.js';
import {get_by_id} from './utils/dom.js';
import {fetch_taxonomies} from './domain/data-queries.js';
import {notifier} from './utils/notifications.js';
import {create_state_proxy, StoreActions} from './domain/store.js';
import {configure} from 'mobx';
import {UserInteractions} from './domain/user-interactions.js';
import {Platform} from './components/Platform.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

// this is relatively important in the sense that it constraints us to mutate the store only in actions
// otherwise, changing the store, affecting the state each time, can be compared to an open heart hemorrhage
configure({
    enforceActions: 'always',
});

addEventListener('DOMContentLoaded', async () => {

    const state_proxy = create_state_proxy();
    const store_actions = new StoreActions(state_proxy);
    const user_interactions = new UserInteractions(store_actions);

    ReactDOM.render(
        <Platform state_proxy={state_proxy} store_actions={store_actions}/>,
        get_by_id('root-platform')
    );
    const map_manager = new MapManager(
        GEOSERVER_URL,
        ANNOTATION_NAMESPACE_URI,
        ANNOTATION_NAMESPACE,
        ANNOTATION_LAYER,
        'map',
        state_proxy,
        store_actions
    );
    new TaxonomyBrowser(map_manager, state_proxy, store_actions, user_interactions);

    try {
        const taxonomies = await fetch_taxonomies();
        store_actions.set_taxonomy(taxonomies);
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
    register_section_handles('section-handle');
});
