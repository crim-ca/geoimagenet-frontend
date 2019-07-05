import React from 'react';
import ReactDOM from 'react-dom';

import {NotificationContainer} from 'react-notifications';

import './css/base.css';
import './css/notifications.css';
import './img/icons/favicon.ico';
import './img/background.hack.jpg';

import * as Sentry from '@sentry/browser';
import {ThemedComponent} from './utils/react.js';
import {PresentationContainer} from './components/Presentation.js';
import {UserInteractions} from './domain/user-interactions.js';
import {create_state_proxy, StoreActions} from './store';
import {DataQueries} from './domain/data-queries.js';
import {create_client} from './utils/apollo';

Sentry.init({
    dsn: FRONTEND_JS_SENTRY_DSN,
});

addEventListener('DOMContentLoaded', () => {

    const div = document.createElement('div');
    div.classList.add('root');
    document.body.appendChild(div);

    const client = create_client(GRAPHQL_ENDPOINT);

    const state_proxy = create_state_proxy();
    const store_actions = new StoreActions(state_proxy);
    const data_queries = new DataQueries(GEOIMAGENET_API_URL, MAGPIE_ENDPOINT, ML_ENDPOINT);
    const user_interactions = new UserInteractions(store_actions, data_queries);

    ReactDOM.render(
        <ThemedComponent>
            <PresentationContainer
                contact_email={CONTACT_EMAIL}
                user_interactions={user_interactions}
                client={client} />
            <NotificationContainer/>
        </ThemedComponent>,
        div
    );
});
