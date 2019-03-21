import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import {CssBaseline, MuiThemeProvider} from '@material-ui/core';

import {DataQueries} from './domain/data-queries.js';
import {create_state_proxy, StoreActions} from './domain/store.js';
import {UserInteractions} from './domain/user-interactions.js';
import {element, get_by_id} from './utils/dom.js';
import LoggedLayout from './components/LoggedLayout.js';
import {Datasets} from './components/Datasets.js';
import {theme} from './utils/react.js';

import './css/base.css';
import './css/notifications.css';
import './img/icons/favicon.ico';

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
            <LoggedLayout><Datasets datasets={[]} /></LoggedLayout>
        </MuiThemeProvider>,
        get_by_id('root')
    );
});
