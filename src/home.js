// @flow strict

import { hot } from 'react-hot-loader/root'
import React from 'react'
import ReactDOM from 'react-dom'

import * as Sentry from '@sentry/browser'

import { DataQueries } from './domain/data-queries.js'
import { StoreActions } from './store/StoreActions'
import { UserInteractions } from './domain/user-interactions.js'
import { i18n } from './utils'

import './css/base.css'
import './css/style_platform.css'
import './css/layer_switcher.css'
import 'react-notifications/lib/notifications.css'
import './css/open_layers.css'
import './img/icons/favicon.ico'
import './img/background.hack.jpg'

import { captureException } from '@sentry/browser'
import { LoadingSplashCircle } from './components/LoadingSplashCircle'
import { OpenLayersStore } from './store/OpenLayersStore'
import Collection from 'ol/Collection'
import { state_proxy, taxonomy_store } from './store/instance_cache'

import { App } from './App'
import type { TaxonomyStore } from './store/TaxonomyStore'
import type { GeoImageNetStore } from './store/GeoImageNetStore'
import { create_client } from './utils/apollo'

Sentry.init({
  dsn: FRONTEND_JS_SENTRY_DSN,
})

const HotApp = hot(App)

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

  state_proxy: GeoImageNetStore
  taxonomy_store: TaxonomyStore
  store_actions: StoreActions
  open_layers_store: OpenLayersStore
  data_queries: DataQueries
  user_interactions: UserInteractions

  constructor(geoimagenet_api_endpoint: string, geoserver_endpoint: string, magpie_endpoint: string, ml_endpoint: string, i18next_instance: i18n) {
    this.state_proxy = state_proxy
    this.taxonomy_store = taxonomy_store
    this.open_layers_store = new OpenLayersStore(new Collection())
    this.store_actions = new StoreActions(this.state_proxy, this.taxonomy_store)
    this.data_queries = new DataQueries(geoimagenet_api_endpoint, geoserver_endpoint, magpie_endpoint, ml_endpoint)
    this.user_interactions = new UserInteractions(this.store_actions, this.taxonomy_store, this.data_queries, i18next_instance, this.state_proxy)
  }

  /**
   * Render the react components on the page passing the services to each as needed.
   * Fetch the basic information for the page to show something meaningful.
   * @returns {Promise<void>}
   */
  async init() {

    const div = document.createElement('div')
    div.classList.add('root')
    if (document.body === null) {
      throw new Error('We need a DOM document to execute this code.')
    }
    document.body.appendChild(div)

    ReactDOM.render(<LoadingSplashCircle />, div)

    await this.user_interactions.refresh_user_resources_permissions()
    const { user_interactions, state_proxy } = this
    try {
      // dirtily select the first taxonomy in the list.
      await user_interactions.fetch_taxonomies()
      await user_interactions.select_taxonomy(state_proxy.taxonomies[0])
    } catch (e) {
      captureException(e)
    }

    const client = create_client(GRAPHQL_ENDPOINT)

    ReactDOM.render(
      <HotApp open_layers_store={this.open_layers_store}
              state_proxy={state_proxy}
              store_actions={this.store_actions}
              user_interactions={user_interactions}
              thelper_model_upload_instructions_url={THELPER_MODEL_UPLOAD_INSTRUCTIONS}
              contact_email={CONTACT_EMAIL}
              client={client} />,
      div
    )
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  const platform_loader = new PlatformLoader(GEOIMAGENET_API_URL, GEOSERVER_URL, MAGPIE_ENDPOINT, ML_ENDPOINT, i18n)
  try {
    await platform_loader.init()
  } catch (e) {
    Sentry.captureException(e)
  }
})
