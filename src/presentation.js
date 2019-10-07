import React from 'react';
import ReactDOM from 'react-dom';

import {NotificationContainer} from 'react-notifications';

import './css/base.css';
import 'react-notifications/lib/notifications.css';
import './img/icons/favicon.ico';
import './img/background.hack.jpg';

import * as Sentry from '@sentry/browser';
import {ThemedComponent} from './utils/react.js';
import {PresentationContainer} from './components/Presentation/Presentation.js';
import {UserInteractions} from './domain/user-interactions.js';
import {StoreActions} from './store/StoreActions';
import {DataQueries} from './domain/data-queries.js';
import {create_client} from './utils/apollo';
import {i18n} from './utils';
import {ApolloProvider} from "react-apollo";
import {state_proxy, taxonomy_store} from './store/instance_cache';

Sentry.init({
    dsn: FRONTEND_JS_SENTRY_DSN,
});

addEventListener('DOMContentLoaded', async () => {

    const div = document.createElement('div');
    div.classList.add('root');
    document.body.appendChild(div);

    const client = create_client(GRAPHQL_ENDPOINT);

    const store_actions = new StoreActions(state_proxy, taxonomy_store);
    const data_queries = new DataQueries(GEOIMAGENET_API_URL, GEOSERVER_URL, MAGPIE_ENDPOINT, ML_ENDPOINT);
    const user_interactions = new UserInteractions(store_actions, taxonomy_store, data_queries, i18n, state_proxy);

    ReactDOM.render(
        <ThemedComponent>
            <ApolloProvider client={client}>
                <div style={{height: '100%'}}>
                    <PresentationContainer
                        state_proxy={state_proxy}
                        contact_email={CONTACT_EMAIL}
                        user_interactions={user_interactions} />
                    <NotificationContainer />
                </div>
            </ApolloProvider>
        </ThemedComponent>,
        div
    );

    await user_interactions.fetch_taxonomies();
    await user_interactions.select_taxonomy(state_proxy.taxonomies[0]);
});
