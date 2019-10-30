// @flow strict
import React from 'react';
import { withStyles } from '@material-ui/core';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { autorun } from 'mobx';
import { LayerSwitcher } from '../../LayerSwitcher';
import { ui_store } from '../../store/instance_cache';
import type { TaxonomyStore } from '../../store/TaxonomyStore';
import type { UserInteractions } from '../../domain';
import type { StoreActions } from '../../store/StoreActions';
import type { OpenLayersStore } from '../../store/OpenLayersStore';
import type { GeoImageNetStore } from '../../store/GeoImageNetStore';
import { MapManager } from './MapManager';
import { Interactions } from './Interactions';

type Props = {
  classes: { root: {} },
  state_proxy: GeoImageNetStore,
  taxonomy_store: TaxonomyStore,
  store_actions: StoreActions,
  user_interactions: UserInteractions,
  open_layers_store: OpenLayersStore,
};

const styles = {
  root: {
    gridRow: '1/3',
    gridColumn: '1/3',
  },
};

class MapContainer extends React.Component<Props> {
  map_manager: MapManager;

  /**
   * Since we need DOM elements to exist to create Open Layers maps, we hook onto React's componentDidMount lifecycle
   * callback and create the map manager only when the dom is correctly created.
   */
  componentDidMount(): void {
    const {
      state_proxy,
      store_actions,
      taxonomy_store,
      user_interactions,
      open_layers_store,
    } = this.props;

    user_interactions.populate_image_dictionary();

    /**
     * The Layer Switcher is paramount to the map: it should allow easy access and toggling to the various displayed layers.
     */
    const layer_switcher = new LayerSwitcher(
      { target: 'layer-switcher' },
      store_actions.toggle_annotation_status_visibility,
    );

    const view = new View({
      center: fromLonLat(open_layers_store.center),
      zoom: open_layers_store.zoom_level,
    });

    let first = true;
    autorun(() => {
      const { extent } = open_layers_store;
      if (first === true) {
        first = false;
        return;
      }
      view.fit(extent, { duration: 800 });
    });


    this.map_manager = new MapManager(
      GEOSERVER_URL,
      ANNOTATION_NAMESPACE,
      ANNOTATION_LAYER,
      'map',
      view,
      state_proxy,
      ui_store,
      open_layers_store,
      store_actions,
      layer_switcher,
      user_interactions,
      taxonomy_store,
    );

    new Interactions(
      this.map_manager.map,
      state_proxy,
      user_interactions,
      open_layers_store,
      ui_store,
      taxonomy_store,
      this.map_manager.GeoJSONFormat,
      this.map_manager.WKTFormat,
      ANNOTATION_LAYER,
    );
  }

  render() {
    const { classes } = this.props;
    return <div id="map" className={classes.root} />;
  }
}

const component = withStyles(styles)(MapContainer);
export { component as MapContainer };
