// @flow strict

import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import { Platform } from './components/Platform/Platform'
import { Datasets } from './components/Datasets/Datasets'
import { Models } from './components/Models/Models'
import { Benchmarks } from './components/Benchmarks'
import { theme, ThemedComponent } from './utils/react'
import { PresentationContainer } from './components/Presentation/Presentation'
import { NotificationContainer } from 'react-notifications'

import type { OpenLayersStore } from './store/OpenLayersStore'
import type { GeoImageNetStore } from './store/GeoImageNetStore'
import type { StoreActions } from './store/StoreActions'
import type { UserInteractions } from './domain'
import { CssBaseline, MuiThemeProvider } from '@material-ui/core'
import { ApolloProvider } from 'react-apollo'
import { DialogContainer } from './components/Dialogs'
import { ContextualMenuContainer } from './components/ContextualMenu/ContextualMenuContainer'
import { LoggedLayout } from './components/LoggedLayout'
import { ApolloClient } from 'apollo-client'

type Props = {
  open_layers_store: OpenLayersStore,
  state_proxy: GeoImageNetStore,
  store_actions: StoreActions,
  user_interactions: UserInteractions,
  thelper_model_upload_instructions_url: string,
  contact_email: string,
  client: ApolloClient,
};

class App extends React.Component<Props> {
  content() {
    const {
      open_layers_store,
      state_proxy,
      store_actions,
      user_interactions,
      thelper_model_upload_instructions_url,
      contact_email,
    } = this.props
    return (
      <Switch>
        <Route path='/platform'>
          <Platform
            open_layers_store={open_layers_store}
            state_proxy={state_proxy}
            store_actions={store_actions}
            user_interactions={user_interactions} />
        </Route>
        <Route path='/datasets'>
          <Datasets
            state_proxy={state_proxy} />
        </Route>
        <Route path='/models'>
          <Models model_upload_instructions_url={thelper_model_upload_instructions_url} />
        </Route>
        <Route path='/benchmarks'><Benchmarks /></Route>
        <Route path='/'>
          <ThemedComponent>
            <div style={{ height: '100%' }}>
              <PresentationContainer
                state_proxy={state_proxy}
                contact_email={contact_email}
                user_interactions={user_interactions} />
              <NotificationContainer />
            </div>
          </ThemedComponent>
        </Route>
      </Switch>
    )
  }

  render() {
    const {
      client,
      state_proxy,
      user_interactions,
    } = this.props
    const { acl: { authenticated } } = state_proxy
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <ApolloProvider client={client}>
            {authenticated
              ? (
                <LoggedLayout state_proxy={state_proxy} user_interactions={user_interactions}>
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
    )
  }
}

export { App }
