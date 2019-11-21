// @flow strict
import React from 'react';
import { withStyles } from '@material-ui/core';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { autorun } from 'mobx';
import { LayerSwitcher } from '../../LayerSwitcher';
import { uiStore } from '../../model/instance_cache';
import type { TaxonomyStore } from '../../model/store/TaxonomyStore';
import type { UserInteractions } from '../../domain';
import type { StoreActions } from '../../model/StoreActions';
import type { OpenLayersStore } from '../../model/store/OpenLayersStore';
import type { GeoImageNetStore } from '../../model/store/GeoImageNetStore';
import { MapManager } from './MapManager';
import { Interactions } from './Interactions';

type Props = {
  classes: { root: {} },
  geoImageNetStore: GeoImageNetStore,
  taxonomyStore: TaxonomyStore,
  storeActions: StoreActions,
  userInteractions: UserInteractions,
  openLayersStore: OpenLayersStore,
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
      geoImageNetStore,
      storeActions,
      taxonomyStore,
      userInteractions,
      openLayersStore,
    } = this.props;

    userInteractions.populate_image_dictionary();

    /**
     * The Layer Switcher is paramount to the map: it should allow easy access and toggling to the various displayed layers.
     */
    const layer_switcher = new LayerSwitcher(
      { target: 'layer-switcher' },
      storeActions.toggle_annotation_status_visibility,
    );

    const view = new View({
      center: fromLonLat(openLayersStore.center),
      zoom: openLayersStore.zoom_level,
    });

    let first = true;
    autorun(() => {
      const { extent } = openLayersStore;
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
      geoImageNetStore,
      uiStore,
      openLayersStore,
      storeActions,
      layer_switcher,
      userInteractions,
      taxonomyStore,
    );

    new Interactions(
      this.map_manager.map,
      geoImageNetStore,
      userInteractions,
      openLayersStore,
      uiStore,
      taxonomyStore,
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
