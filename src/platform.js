import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import {CssBaseline, MuiThemeProvider} from '@material-ui/core';

import {register_section_handles} from './utils/sections.js';
import {DataQueries} from './domain/data-queries.js';
import {notifier} from './utils/notifications.js';
import {create_state_proxy, StoreActions} from './store';
import {UserInteractions} from './domain/user-interactions.js';
import {Platform} from './components/Platform.js';
import {LoggedLayout} from './components/LoggedLayout.js';

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

/**
 * When initiating the platform, we need to
 * - set up the OL Map
 * - get information from Geoserver for the layers (images, annotations, image markers)
 * - get information from magpie as for the login status
 * - get information from the api (taxonomies, taxonomy classes)
 *
 * For that, we instantiate the various services that will be used, then inject them into the actual classes that do it.
 */
export class PlatformLoader {

    /**
     * @param {String} geoimagenet_api_endpoint geoimagenet api deployed endpoint to use in this instance of the platform
     * @param {String} magpie_endpoint magpie installation to use in this instance of the platform
     */
    constructor(geoimagenet_api_endpoint, magpie_endpoint) {
        /**
         * @private
         * @type {GeoImageNetStore}
         */
        this.state_proxy = create_state_proxy();
        /**
         * @private
         * @type {StoreActions}
         */
        this.store_actions = new StoreActions(this.state_proxy);
        /**
         * @private
         * @type {DataQueries}
         */
        this.data_queries = new DataQueries(geoimagenet_api_endpoint, magpie_endpoint);
        /**
         * @private
         * @type {UserInteractions}
         */
        this.user_interactions = new UserInteractions(this.store_actions, this.data_queries);
    }

    /**
     * Render the react components on the page passing the services to each as needed.
     * Fetch the basic information for the page to show something meaningful.
     * @returns {Promise<void>}
     */
    async init() {

        const div = document.createElement('div');
        div.classList.add('root');
        document.body.appendChild(div);

        ReactDOM.render(
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <LoggedLayout state_proxy={this.state_proxy} user_interactions={this.user_interactions}>
                    <Platform
                        state_proxy={this.state_proxy}
                        store_actions={this.store_actions}
                        user_interactions={this.user_interactions}
                        data_queries={this.data_queries} />
                </LoggedLayout>
            </MuiThemeProvider>,
            div
        );

        await this.user_interactions.fetch_taxonomies();
        register_section_handles('section-handle');
    }
}

addEventListener('DOMContentLoaded', async () => {
    const platform_loader = new PlatformLoader(GEOIMAGENET_API_URL, MAGPIE_ENDPOINT);
    try {
        await platform_loader.init();
    } catch (e) {
        Sentry.captureException(e);
    }
});
