import React from 'react';
import ReactDOM from 'react-dom';

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

Sentry.init({
    dsn: 'https://e7309c463efe4d85abc7693a6334e8df@sentry.crim.ca/21',
});

addEventListener('DOMContentLoaded', () => {

    const div = document.createElement('div');
    div.classList.add('root');
    document.body.appendChild(div);

    const state_proxy = create_state_proxy();
    const store_actions = new StoreActions(state_proxy);
    const data_queries = new DataQueries(GEOIMAGENET_API_URL, MAGPIE_ENDPOINT, ML_ENDPOINT);
    const user_interactions = new UserInteractions(store_actions, data_queries);

    ReactDOM.render(
        <ThemedComponent>
            <PresentationContainer user_interactions={user_interactions} />
        </ThemedComponent>,
        div
    );
});
