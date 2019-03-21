import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import {CssBaseline, MuiThemeProvider} from '@material-ui/core';

import {register_section_handles} from './utils/sections.js';
import {DataQueries} from './domain/data-queries.js';
import {notifier} from './utils/notifications.js';
import {create_state_proxy, StoreActions} from './domain/store.js';
import {UserInteractions} from './domain/user-interactions.js';
import {Platform} from './components/Platform.js';
import {element, get_by_id} from './utils/dom.js';
import LoggedLayout from './components/LoggedLayout.js';

import './css/base.css';
import './css/style_platform.css';
import './css/layer_switcher.css';
import './css/notifications.css';
import './css/open_layers.css';
import './img/icons/favicon.ico';

import {theme} from './utils/react.js';

Sentry.init({
    dsn: 'https://e7309c463efe4d85abc7693a6334e8df@sentry.crim.ca/21'
});

addEventListener('DOMContentLoaded', async () => {

    const state_proxy = create_state_proxy();
    const store_actions = new StoreActions(state_proxy);
    const data_queries = new DataQueries(GEOIMAGENET_API_URL, MAGPIE_ENDPOINT);
    const user_interactions = new UserInteractions(store_actions, data_queries);

    const div = element('div');
    div.id = 'root';
    div.classList.add('root');
    document.body.appendChild(div);

    ReactDOM.render(
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <LoggedLayout>
                <Platform
                    state_proxy={state_proxy}
                    store_actions={store_actions}
                    user_interactions={user_interactions}
                    data_queries={data_queries} />
            </LoggedLayout>
        </MuiThemeProvider>,
        get_by_id('root')
    );
    //new TaxonomyBrowser(map_manager, state_proxy, store_actions, user_interactions);

    try {
        const taxonomies = await data_queries.fetch_taxonomies();
        store_actions.set_taxonomy(taxonomies);
    } catch (e) {
        switch (e.status) {
            case 404:
                notifier.warning('There doesn\'t seem to be any taxonomy available in the API (we received a 404 not-found status). ' +
                    'This will likely render the platform unusable until someone populates the taxonomies.');
                break;
            default:
                notifier.error('We could not fetch the taxonomies. This will heavily and negatively impact the platform use.');
        }
    }
    register_section_handles('section-handle');
});
