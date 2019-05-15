import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import {CssBaseline, MuiThemeProvider} from '@material-ui/core';

import {DataQueries} from './domain/data-queries.js';
import {create_state_proxy, StoreActions} from './store';
import {UserInteractions} from './domain/user-interactions.js';
import {element, get_by_id} from './utils/dom.js';
import {LoggedLayout} from './components/LoggedLayout.js';
import {Datasets} from './components/Datasets.js';
import {theme} from './utils/react.js';

import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';

/**
 * removing the typename from the responses because it breaks automatic displaying of results, taken from https://github.com/apollographql/apollo-client/issues/1913#issuecomment-374869527
 * Not quite sure what the typename part itself does, comments suggest it affects caching, I deem the risks of not caching responses
 * in the most efficient way to be sufficiently low in this prototype context to not really bother with this.
 * @type {InMemoryCache}
 */
const cache = new InMemoryCache({
    addTypename: false
});
const link = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    credentials: 'same-origin',
});
const client = new ApolloClient({
    cache,
    link
});

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

    const div = element('div');
    div.id = 'root';
    div.classList.add('root');
    document.body.appendChild(div);

    ReactDOM.render(
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <ApolloProvider client={client}>
                <LoggedLayout state_proxy={state_proxy} user_interactions={user_interactions}>
                    <Datasets
                        state_proxy={state_proxy}
                        user_interactions={user_interactions}
                        store_actions={store_actions} />
                </LoggedLayout>
            </ApolloProvider>

        </MuiThemeProvider>,
        get_by_id('root')
    );

    await user_interactions.refresh_user_resources_permissions();
});
