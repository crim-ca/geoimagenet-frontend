import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import {CssBaseline, MuiThemeProvider} from '@material-ui/core';

import {DataQueries} from './domain/data-queries.js';
import {create_state_proxy, StoreActions} from './store';
import {UserInteractions} from './domain/user-interactions.js';
import {element, get_by_id} from './utils/dom.js';
import {LoggedLayout} from './components/LoggedLayout.js';
import {Models} from './components/Models';
import {theme} from './utils/react.js';

import {create_client} from './utils/apollo';
import {ApolloProvider} from 'react-apollo';

import './css/base.css';
import './css/notifications.css';
import './img/icons/favicon.ico';

Sentry.init({
    dsn: 'https://e7309c463efe4d85abc7693a6334e8df@sentry.crim.ca/21'
});

addEventListener('DOMContentLoaded', async () => {

    const state_proxy = create_state_proxy();
    const store_actions = new StoreActions(state_proxy);
    const data_queries = new DataQueries(GEOIMAGENET_API_URL, MAGPIE_ENDPOINT, ML_ENDPOINT);
    const user_interactions = new UserInteractions(store_actions, data_queries);
    const apollo_client = create_client(GRAPHQL_ENDPOINT);

    const div = element('div');
    div.id = 'root';
    div.classList.add('root');
    document.body.appendChild(div);

    ReactDOM.render(
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <ApolloProvider client={apollo_client}>
                <LoggedLayout state_proxy={state_proxy} user_interactions={user_interactions}>
                    <Models />
                </LoggedLayout>
            </ApolloProvider>

        </MuiThemeProvider>,
        get_by_id('root')
    );

    await user_interactions.refresh_user_resources_permissions();
});
