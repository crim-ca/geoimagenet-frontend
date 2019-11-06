// @flow strict
/**
 * We group the Open Layers map interactions here
 */
import { autorun } from 'mobx';
import { Draw, Modify, Select } from 'ol/interaction';
import { NotificationManager } from 'react-notifications';
import typeof Map from 'ol/Map';
import GeoJSON from 'ol/format/GeoJSON';
import WKT from 'ol/format/WKT';
import { MapBrowserEvent } from 'ol/events';
import type Event from 'ol/events/Event';
import type { Feature } from 'ol';
import { ANNOTATION, CUSTOM_GEOIM_IMAGE_LAYER, MODE, VALID_OPENLAYERS_ANNOTATION_RESOLUTION } from '../../constants';
import { GeoImageNetStore } from '../../store/GeoImageNetStore';
import { UserInteractions } from '../../domain';
import { ContextualMenuManager } from '../ContextualMenu/ContextualMenuManager';
import type { OpenLayersStore } from '../../store/OpenLayersStore';
import type { TaxonomyStore } from '../../store/TaxonomyStore';
import { createStyleFunction } from './ol_dependant_utils';
import { UserInterfaceStore } from '../../store/UserInterfaceStore';

function selectableFeatures(features: Feature[]) {
  /**
   * if we are clicking on a single feature, on on empty space,
   * we want to consider this event correctly
   */
  if (features === null || features.length < 2) {
    return true;
  }
  /**
   * If one of the features does not yet have an id, we are currently drawing,
   * so let things go normally
   */
  return features.some((f) => !f.get('id'));
}

const makeFeatureSelectionCondition = (
  map: Map,
  taxonomyStore: TaxonomyStore,
  openLayersStore: OpenLayersStore,
) => (event: MapBrowserEvent) => {
  if (event.type !== 'click') {
    return false;
  }
  const { pixel } = event;
  const features = map.getFeaturesAtPixel(pixel);

  if (selectableFeatures(features)) {
    return true;
  }
  /**
   * if we got here, technically there are multiple features under the click, so we want to ask user what feature they want to select,
   * and then add that feature to the selected features collection.
   */
  const menuItems = [];

  features.forEach((feature) => {
    const taxonomyClassId = feature.get('taxonomy_class_id');
    menuItems.push({
      text: taxonomyStore.flat_taxonomy_classes[taxonomyClassId].name_en,
      value: feature,
    });
  });

  ContextualMenuManager.choose_option(menuItems)
    .then(
      (choice) => {
        openLayersStore.select_feature(choice);
      },
      (error) => {
        console.log(error);
        openLayersStore.clear_selected_features();
        NotificationManager.info('That wasn\'t a valid feature choice, we unselected everything.');
      },
    );
  return false;
};

/**
 * The Interactions class was intended as the repository where the various Open Layers interactions live.
 * OL Interactions are classes from their bundle that represent an user's interaction with the viewport, be it a click,
 * or a feature creation / modification.
 */
export class Interactions {
  map: Map;

  stateProxy: GeoImageNetStore;

  taxonomyStore: TaxonomyStore;

  userInteractions: UserInteractions;

  uiStore: UserInterfaceStore;

  openLayersStore: OpenLayersStore;

  GeoJSONFormat: GeoJSON;

  WKTFormat: WKT;

  annotationLayer: string;

  draw: Draw;

  modify: Modify;

  select: Select;

  constructor(
    map: Map,
    stateProxy: GeoImageNetStore,
    userInteractions: UserInteractions,
    openLayersStore: OpenLayersStore,
    uiStore: UserInterfaceStore,
    taxonomyStore: TaxonomyStore,
    GeoJSONFormat: GeoJSON,
    WKTFormat: WKT,
    annotationLayer: string,
  ) {
    this.map = map;
    this.stateProxy = stateProxy;
    this.userInteractions = userInteractions;
    this.openLayersStore = openLayersStore;
    this.uiStore = uiStore;
    this.taxonomyStore = taxonomyStore;
    this.GeoJSONFormat = GeoJSONFormat;
    this.WKTFormat = WKTFormat;
    this.annotationLayer = annotationLayer;

    const layers = Object.keys(this.stateProxy.annotations_layers)
      .map((key) => this.stateProxy.annotations_layers[key]);
    /**
     * We can select layers from any and all layers, so we activate it on all layers by default.
     */
    this.select = new Select({
      condition: makeFeatureSelectionCondition(map, this.taxonomyStore, this.openLayersStore),
      layers,
      style: createStyleFunction('white', this.stateProxy, this.taxonomyStore, true),
      features: this.openLayersStore.selected_features,
    });
    this.map.addInteraction(this.select);

    /**
     * Map interaction to modify existing annotations. To be disabled when zoomed out too far.
     */
    this.modify = new Modify({
      features: this.stateProxy.annotations_collections[ANNOTATION.STATUS.NEW],
    });
    /**
     * Map interaction to create new annotations. To be disabled when zoomed out too far.
     */
    this.draw = new Draw({
      source: this.stateProxy.annotations_sources[ANNOTATION.STATUS.NEW],
      type: 'Polygon',
      condition: this.draw_condition_callback,
    });

    this.draw.on('drawstart', () => this.select.setActive(false));
    this.draw.on('drawend', this.userInteractions.create_drawend_handler(this.GeoJSONFormat, this.WKTFormat, this.annotationLayer));
    this.draw.on('drawend', () => this.select.setActive(true));
    this.modify.on('modifystart', this.userInteractions.modifystart_handler);
    this.modify.on('modifyend', this.userInteractions.create_modifyend_handler(this.GeoJSONFormat, this.WKTFormat, this.map));

    autorun(() => {
      switch (this.uiStore.selectedMode) {
        // Before adding an interaction, remove it or else it could be added twice
        case MODE.CREATION:

          if (this.taxonomyStore.selected_taxonomy_class_id > 0) {
            this.map.removeInteraction(this.draw);
            this.map.addInteraction(this.draw);
          }
          this.map.removeInteraction(this.modify);
          break;
        case MODE.MODIFICATION:
          this.map.removeInteraction(this.modify);
          this.map.addInteraction(this.modify);
          this.map.removeInteraction(this.draw);
          break;
        default:
          this.map.removeInteraction(this.modify);
          this.map.removeInteraction(this.draw);
      }
    });
  }

  /**
   * When in annotation mode, we need some kind of control over the effect of each click.
   * This callback should check domain conditions for the click to be valid and return a boolean to that effect.
   * Domain prevalidation of annotations should happen here.
   */
  draw_condition_callback = (event: Event): boolean => {
    /**
     * make sure that each click is correct to create the annotation
     * in all events reject the click if the resolution is too far away
     *
     * if we are the first click, only verify that we are over an image layer
     * if we are clicks afterwards, verify that we are over the same image
     */
    const { map } = event;
    const view = map.getView();
    const resolution = view.get('resolution');

    if (resolution > VALID_OPENLAYERS_ANNOTATION_RESOLUTION) {
      NotificationManager.warning('You are too far away to create a meaningful annotation. Please zoom in.');
      return false;
    }

    const layers = [];
    const options = {
      layerFilter: (layer) => layer.get('type') === CUSTOM_GEOIM_IMAGE_LAYER,
    };
    event.map.forEachLayerAtPixel(event.pixel, (layer) => {
      layers.push(layer);
    }, options);

    if (!layers.length) {
      if (this.stateProxy.current_annotation.initialized) {
        NotificationManager.warning('All corners of an annotation polygon must be on an image.');
      } else {
        NotificationManager.warning('You must select an image to begin creating annotations.');
      }
      return false;
    }

    // forEachLayerAtPixel should return the topmost layer first
    const top_layer = layers[0];

    this.userInteractions.start_annotation(top_layer.get('title'));

    return true;
  };
}
