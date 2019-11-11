// @flow strict
import { hot } from 'react-hot-loader/root';
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import Collection from 'ol/Collection';
import { DataQueries } from './domain/data-queries';
import { StoreActions } from './model/StoreActions';
import { UserInteractions } from './domain/user-interactions';
import { i18n } from './utils';

import './css/base.css';
import './css/style_platform.css';
import './css/layer_switcher.css';
import 'react-notifications/lib/notifications.css';
import './css/open_layers.css';
import './img/icons/favicon.ico';
import './img/background.hack.jpg';

import { LoadingSplashCircle } from './components/LoadingSplashCircle';
import { OpenLayersStore } from './model/store/OpenLayersStore';
import { geoImageNetStore, taxonomyStore, uiStore } from './model/instance_cache';

import { App } from './App';
import type { TaxonomyStore } from './model/store/TaxonomyStore';
import type { GeoImageNetStore } from './model/store/GeoImageNetStore';
import { createClient } from './utils/apollo';

Sentry.init({
  dsn: FRONTEND_JS_SENTRY_DSN,
  debug: process.env.NODE_ENV === 'development',
});

const HotApp = hot(App);

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
  geoImageNetStore: GeoImageNetStore;

  taxonomyStore: TaxonomyStore;

  storeActions: StoreActions;

  openLayersStore: OpenLayersStore;

  dataQueries: DataQueries;

  userInteractions: UserInteractions;

  constructor(geoimagenet_api_endpoint: string, geoserver_endpoint: string, magpie_endpoint: string, ml_endpoint: string, i18next_instance: i18n) {
    this.geoImageNetStore = geoImageNetStore;
    this.taxonomyStore = taxonomyStore;
    this.openLayersStore = new OpenLayersStore(new Collection());
    this.storeActions = new StoreActions(this.geoImageNetStore, this.taxonomyStore, uiStore);
    this.dataQueries = new DataQueries(geoimagenet_api_endpoint, geoserver_endpoint, magpie_endpoint, ml_endpoint);
    this.userInteractions = new UserInteractions(this.storeActions, this.taxonomyStore, this.dataQueries, i18next_instance, this.geoImageNetStore);
  }

  /**
   * Render the react components on the page passing the services to each as needed.
   * Fetch the basic information for the page to show something meaningful.
   * @returns {Promise<void>}
   */
  async init() {
    const div = document.createElement('div');
    div.classList.add('root');
    if (document.body === null) {
      throw new Error('We need a DOM document to execute this code.');
    }
    document.body.appendChild(div);

    ReactDOM.render(<LoadingSplashCircle />, div);

    await this.userInteractions.refresh_user_resources_permissions();
    const { userInteractions, geoImageNetStore } = this;
    try {
      // dirtily select the first taxonomy in the list.
      await userInteractions.fetch_taxonomies();
      await userInteractions.select_taxonomy(geoImageNetStore.taxonomies[0]);
    } catch (e) {
      Sentry.captureException(e);
    }

    const client = createClient(GRAPHQL_ENDPOINT);

    ReactDOM.render(
      <HotApp
        openLayersStore={this.openLayersStore}
        geoImageNetStore={geoImageNetStore}
        storeActions={this.storeActions}
        userInteractions={userInteractions}
        thelper_model_upload_instructions_url={THELPER_MODEL_UPLOAD_INSTRUCTIONS}
        contact_email={CONTACT_EMAIL}
        client={client}
      />,
      div,
    );
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const platformLoader = new PlatformLoader(GEOIMAGENET_API_URL, GEOSERVER_URL, MAGPIE_ENDPOINT, ML_ENDPOINT, i18n);
    await platformLoader.init();
  } catch (e) {
    console.log(e);
    Sentry.captureException(e);
  }
});
