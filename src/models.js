import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import {CssBaseline, MuiThemeProvider} from '@material-ui/core';

import {DataQueries} from './domain/data-queries.js';
import {create_state_proxy, StoreActions} from './store';
import {UserInteractions} from './domain/user-interactions.js';
import {LoggedLayout} from './components/LoggedLayout.js';
import {Models} from './components/Models';
import {theme} from './utils/react.js';
import {i18n} from './utils';

import {create_client} from './utils/apollo';
import {ApolloProvider} from 'react-apollo';

import './css/base.css';
import 'react-notifications/lib/notifications.css';
import './img/icons/favicon.ico';

Sentry.init({
    dsn: FRONTEND_JS_SENTRY_DSN,
});

addEventListener('DOMContentLoaded', async () => {

    const state_proxy = create_state_proxy();
    const store_actions = new StoreActions(state_proxy);
    const data_queries = new DataQueries(GEOIMAGENET_API_URL, MAGPIE_ENDPOINT, ML_ENDPOINT);
    const user_interactions = new UserInteractions(store_actions, data_queries, i18n);
    const apollo_client = create_client(GRAPHQL_ENDPOINT);

    const div = document.createElement('div');
    div.id = 'root';
    div.classList.add('root');
    document.body.appendChild(div);

    ReactDOM.render(
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <ApolloProvider client={apollo_client}>
                <LoggedLayout state_proxy={state_proxy} user_interactions={user_interactions}>
                    <Models model_upload_instructions_url={THELPER_MODEL_UPLOAD_INSTRUCTIONS} />
                </LoggedLayout>
            </ApolloProvider>

        </MuiThemeProvider>,
        div
    );

    await user_interactions.refresh_user_resources_permissions();
});
