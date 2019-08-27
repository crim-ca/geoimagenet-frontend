import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import {CssBaseline, MuiThemeProvider} from '@material-ui/core';

import {DataQueries} from './domain/data-queries.js';
import {create_state_proxy, StoreActions} from './store';
import {UserInteractions} from './domain/user-interactions.js';
import {Platform} from './components/Platform.js';
import {LoggedLayout} from './components/LoggedLayout.js';
import {i18n} from './utils';

import {DialogContainer} from './components/Dialogs';

import './css/base.css';
import './css/style_platform.css';
import './css/layer_switcher.css';
import 'react-notifications/lib/notifications.css';
import './css/open_layers.css';
import './img/icons/favicon.ico';

import {theme} from './utils/react.js';
import {NotificationContainer} from "react-notifications";
import {captureException} from "@sentry/browser";
import {GeoImageNetStore} from "./store/GeoImageNetStore";
import {LoadingSplashCircle} from "./components/LoadingSplashCircle";
import {Taxonomy} from "./domain/entities";

Sentry.init({
    dsn: FRONTEND_JS_SENTRY_DSN,
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

    state_proxy: GeoImageNetStore;
    store_actions: StoreActions;
    data_queries: DataQueries;
    user_interactions: UserInteractions;


    constructor(geoimagenet_api_endpoint: string, geoserver_endpoint: string, magpie_endpoint: string, ml_endpoint: string, i18next_instance) {

        this.state_proxy = create_state_proxy();
        this.store_actions = new StoreActions(this.state_proxy);
        this.data_queries = new DataQueries(geoimagenet_api_endpoint, geoserver_endpoint, magpie_endpoint, ml_endpoint);
        this.user_interactions = new UserInteractions(this.store_actions, this.data_queries, i18next_instance, this.state_proxy);
    }

    make_platform() {
        return (
            <Platform
                state_proxy={this.state_proxy}
                store_actions={this.store_actions}
                user_interactions={this.user_interactions} />
        );
    }

    /**
     * we must make sure not to return the whole logged layout when the request is not authenticated: that situation
     * means we are in a demo platform context.
     * @todo at some point add the possibility of quick login from this state so that humans don't need to go back to the home page to login.
     * @returns {*}
     */
    make_layout() {
        const {acl: {authenticated}} = this.state_proxy;
        if (authenticated) {
            return (
                <LoggedLayout state_proxy={this.state_proxy} user_interactions={this.user_interactions}>
                    {this.make_platform()}
                </LoggedLayout>
            );
        }
        return this.make_platform();
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

        ReactDOM.render(<LoadingSplashCircle />, div);

        await this.user_interactions.refresh_user_resources_permissions();
        const {user_interactions, state_proxy} = this;
        try {
            // dirtily select the first taxonomy in the list.
            await user_interactions.fetch_taxonomies();
            await user_interactions.select_taxonomy(state_proxy.taxonomies[0]);
        } catch (e) {
            captureException(e);
        }

        ReactDOM.render(
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {this.make_layout()}
                <DialogContainer />
                <NotificationContainer />
            </MuiThemeProvider>,
            div
        );
    }
}

addEventListener('DOMContentLoaded', async () => {
    const platform_loader = new PlatformLoader(GEOIMAGENET_API_URL, GEOSERVER_URL, MAGPIE_ENDPOINT, ML_ENDPOINT, i18n);
    try {
        await platform_loader.init();
    } catch (e) {
        Sentry.captureException(e);
    }
});
