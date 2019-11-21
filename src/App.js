// @flow strict

import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { Platform } from './components/Platform/Platform';
import { Datasets } from './components/Datasets/Datasets';
import { Models } from './components/Models/Models';
import { Benchmarks } from './components/Benchmarks';
import { theme, ThemedComponent } from './utils/react';
import { PresentationContainer } from './components/Presentation/Presentation';
import { NotificationContainer } from 'react-notifications';

import type { OpenLayersStore } from './model/store/OpenLayersStore';
import type { GeoImageNetStore } from './model/store/GeoImageNetStore';
import type { StoreActions } from './model/StoreActions';
import type { UserInteractions } from './domain';
import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { ApolloProvider } from 'react-apollo';
import { DialogContainer } from './components/Dialogs';
import { ContextualMenuContainer } from './components/ContextualMenu/ContextualMenuContainer';
import { LoggedLayout } from './components/LoggedLayout';
import { ApolloClient } from 'apollo-client';

type Props = {
  openLayersStore: OpenLayersStore,
  geoImageNetStore: GeoImageNetStore,
  storeActions: StoreActions,
  userInteractions: UserInteractions,
  thelper_model_upload_instructions_url: string,
  contact_email: string,
  client: ApolloClient,
};

class App extends React.Component<Props> {
  content() {
    const {
      openLayersStore,
      geoImageNetStore,
      storeActions,
      userInteractions,
      thelper_model_upload_instructions_url,
      contact_email,
    } = this.props;
    return (
      <Switch>
        <Route path='/platform'>
          <Platform
            openLayersStore={openLayersStore}
            geoImageNetStore={geoImageNetStore}
            storeActions={storeActions}
            userInteractions={userInteractions} />
        </Route>
        <Route path='/datasets'>
          <Datasets
            geoImageNetStore={geoImageNetStore} />
        </Route>
        <Route path='/models'>
          <Models model_upload_instructions_url={thelper_model_upload_instructions_url} />
        </Route>
        <Route path='/benchmarks'><Benchmarks /></Route>
        <Route path='/'>
          <ThemedComponent>
            <div style={{ height: '100%' }}>
              <PresentationContainer
                geoImageNetStore={geoImageNetStore}
                contact_email={contact_email}
                userInteractions={userInteractions} />
              <NotificationContainer />
            </div>
          </ThemedComponent>
        </Route>
      </Switch>
    );
  }

  render() {
    const {
      client,
      geoImageNetStore,
      userInteractions,
    } = this.props;
    const { user: { authenticated } } = geoImageNetStore;
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <ApolloProvider client={client}>
            {authenticated
              ? (
                <LoggedLayout geoImageNetStore={geoImageNetStore} userInteractions={userInteractions}>
                  {this.content()}
                </LoggedLayout>
              ) : this.content()
            }
          </ApolloProvider>
          <DialogContainer />
          <NotificationContainer />
          <ContextualMenuContainer />
        </MuiThemeProvider>
      </Router>
    );
  }
}

export { App };
