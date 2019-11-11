// @flow strict
/**
 * This file is a mess, I know it, you know it, now move along and let me refactor
 */
import { autorun } from 'mobx';
import { Group, Vector } from 'ol/layer';
import { get as getProjection } from 'ol/proj';
import { Control, MousePosition, ScaleLine } from 'ol/control';
import { Collection, Feature, Map } from 'ol';
import View from 'ol/View';
import { Event } from 'ol/events';
import { toStringHDMS } from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import { bbox } from 'ol/loadingstrategy';
import {
  Circle,
  Fill,
  Stroke,
  Style,
  Text,
} from 'ol/style';
import { GeoJSON, WMSCapabilities, WKT } from 'ol/format';
import TileLayer from 'ol/layer/Tile';
import {
  BingMaps,
  Cluster,
  OSM,
  TileWMS,
} from 'ol/source';
import TileGrid from 'ol/tilegrid/TileGrid';
import VectorLayer from 'ol/layer/Vector';
import {
  boundingExtent as BoundingExtent,
  buffer as OLBuffer,
  getWidth,
  getTopLeft,
  getCenter,
} from 'ol/extent';
import { NotificationManager } from 'react-notifications';
import {
  MODE,
  ANNOTATION,
  BING_API_KEY,
  Z_INDEX,
  ANNOTATION_STATUS_AS_ARRAY,
  ALLOWED_BING_MAPS,
  CUSTOM_GEOIM_IMAGE_LAYER,
  VALID_OPENLAYERS_ANNOTATION_RESOLUTION,
  READ,
  WMS,
} from '../../constants';
import { debounced } from '../../utils/event_handling';
import { StoreActions } from '../../model/StoreActions';
import { LayerSwitcher } from '../../LayerSwitcher';
import { GeoImageNetStore } from '../../model/store/GeoImageNetStore';
import { make_http_request } from '../../utils/http';
import { UserInteractions } from '../../domain';
import type { TaxonomyStore } from '../../model/store/TaxonomyStore';
import type { OpenLayersStore } from '../../model/store/OpenLayersStore';
import { createStyleFunction } from './ol_dependant_utils';
import { make_annotation_ownership_cql_filter } from './utils';
import { UserInterfaceStore } from '../../model/store/UserInterfaceStore';

async function geoserverCapabilities(url) {
  const parser = new WMSCapabilities();
  const res = await make_http_request(url);
  const text = await res.text();
  return parser.read(text);
}

function navigateToClickedFeatureGroup(features: Feature[], view: View) {
  features.forEach((globalFeatureLayer) => {
    // cluster source features regroup all individual features in one
    if (globalFeatureLayer.get('features')) {
      const actualFeatures = globalFeatureLayer.get('features');
      const coords = [];
      if (actualFeatures.length > 1) {
        actualFeatures.forEach((singleFeature) => {
          const extent = singleFeature.get('geometry')
            .getExtent();
          const min = [extent[0], extent[1]];
          const max = [extent[2], extent[3]];
          coords.push(min);
          coords.push(max);
        });
        const boundingExtent = new BoundingExtent(coords);
        const bufferedExtent = new OLBuffer(boundingExtent, 100);
        view.fit(bufferedExtent, {
          duration: 1000,
        });
      } else {
        const extent = actualFeatures[0].get('geometry')
          .getExtent();
        view.animate({
          center: getCenter(extent),
          resolution: VALID_OPENLAYERS_ANNOTATION_RESOLUTION - 0.0001,
          duration: 1000,
        });
      }
    }
  });
}

/**
 * The MapManager is responsible for handling map behaviour at the boundary between the platform and OpenLayers.
 * It should listen to specific OL events and trigger domain interactions in accordance.
 *
 * We are using arrow functions to bind the scope of member methods
 * changing foo = () => {}; to foo = function() {} _will_ break things in interesting and unexpected ways
 */
export class MapManager {
  /**
   * The deployment's Geoserver endpoint
   */
  geoserverURL: string;

  /**
   * Geoserver classifies annotations in namespaces, we need it to construct urls.
   */
  annotationNamespace: string;

  /**
   * While for the user an annotation represents an instance of a taxonomy class on an image, for the platform
   * it is actually a feature on an OpenLayers layer. Our features are served from a Geoserver instance,
   * and this property should contain the layer mounted on Geoserver that contains our annotations.
   */
  annotationLayer: string;

  CQLForTaxonomyClassId: string = '';

  CQLForOwnership: string = '';

  layerSwitcher: LayerSwitcher;

  storeActions: StoreActions;

  /**
   * We use MobX as state manager, this is our top level MobX observable store.
   */
  geoImageNetStore: GeoImageNetStore;

  uiStore: UserInterfaceStore;

  openLayersStore: OpenLayersStore;

  taxonomyStore: TaxonomyStore;

  GeoJSONFormat: GeoJSON;

  WKTFormat: WKT;

  /**
   * Reference to the OL map instance, that we keep to act upon when needed
   */
  map: Map;

  /**
   * Reference to the OL View object.
   */
  view: View;

  /**
   * We want to show the mouse position to the users, it's called a "control" in open layers.
   */
  mousePosition: Control;

  userInteractions: UserInteractions;

  constructor(
    geoserverURL: string,
    annotationNamespace: string,
    annotationLayer: string,
    mapDivId: string,
    view: View,
    geoImageNetStore: GeoImageNetStore,
    uiStore: UserInterfaceStore,
    openLayersStore: OpenLayersStore,
    storeActions: StoreActions,
    layerSwitcher: LayerSwitcher,
    userInteractions: UserInteractions,
    taxonomyStore: TaxonomyStore,
  ) {
    this.geoserverURL = geoserverURL;
    this.annotationNamespace = annotationNamespace;
    this.annotationLayer = annotationLayer;
    this.geoImageNetStore = geoImageNetStore;
    this.uiStore = uiStore;
    this.openLayersStore = openLayersStore;
    this.taxonomyStore = taxonomyStore;
    this.storeActions = storeActions;
    this.layerSwitcher = layerSwitcher;
    this.userInteractions = userInteractions;
    this.GeoJSONFormat = new GeoJSON({
      dataProjection: 'EPSG:3857',
      featureProjection: 'EPSG:3857',
      geometryName: 'geometry',
    });
    this.WKTFormat = new WKT();
    this.view = view;
    this.map = new Map({
      target: mapDivId,
      view: this.view,
      loadTilesWhileAnimating: true,
      loadTilesWhileInteracting: true,
      pixelRatio: 1,
    });

    this.map.addControl(new ScaleLine());

    if (document.body === null) {
      throw new Error('We need a DOM document to execute this code.');
    }
    const style = getComputedStyle(document.body);

    const { annotations_collections, annotations_sources } = this.geoImageNetStore;

    /**
     * this innocent looking piece of code is actually very central to the map, here we create the Open Layers sources and collections that will hold the features
     * (quick reminder, an GeoImageNet "annotation" is represented on the map as an Open Layers "feature", served with wfs
     * We need to set their color in accordance with their status.
     * We keep references to the collections, sources and layers so that we can access them directly if need be (such as when refreshing sources, or setting style functions)
     */
    ANNOTATION_STATUS_AS_ARRAY.forEach((key) => {
      const color = style.getPropertyValue(`--color-${key}`);
      this.storeActions.set_annotation_collection(key, new Collection());
      this.storeActions.set_annotation_source(key, this.createVectorSource(annotations_collections[key], key));
      const vectorLayer = this.createVectorLayer(key, annotations_sources[key], color, true);
      this.storeActions.set_annotation_layer(key, vectorLayer);
    });

    this.geoImageNetStore.annotations_collections[ANNOTATION.STATUS.NEW].on('add', (e) => {
      e.element.revision_ = 0;
    });


    /**
     * We need to show the layers that are activated in the filters, and refresh them when we change the visible classes selection
     */
    autorun(() => {
      const { annotationStatusFilters, annotationOwnershipFilters } = this.geoImageNetStore;

      this.CQLForTaxonomyClassId = this.taxonomyStore.taxonomy_class_id_selection_cql;

      const ownershipFiltersArray = Object.values(annotationOwnershipFilters);
      // $FlowFixMe
      this.CQLForOwnership = make_annotation_ownership_cql_filter(ownershipFiltersArray, geoImageNetStore.logged_user);

      Object.keys(annotationStatusFilters)
        .forEach((k) => {
          const { activated, text } = annotationStatusFilters[k];
          const annotations_layers = this.geoImageNetStore;
          this.geoImageNetStore.annotations_layers[text].setVisible(activated);
          if (activated) {
            this.userInteractions.refresh_source_by_status(text);
          }
        });
    });

    // We set the layers and the layer switcher here
    this.makeLayers();

    this.mousePosition = new MousePosition({
      coordinateFormat: toStringHDMS,
      projection: 'EPSG:4326',
      undefinedHTML: '&nbsp;',
      target: 'coordinates',
    });
    this.map.addControl(this.mousePosition);

    this.map.addEventListener('click', this.receiveMapViewportClickEvent);

    autorun(() => {
      const { show_labels, show_annotators_identifiers, annotationStatusFilters } = this.geoImageNetStore;
      /**
       * This clunky switch is used so that MobX registers the access to the show_labels property.
       * we assign noise only for mobx to rerun this function as well.
       *
       * this is horrible, there must be a way to change the style globally without reloading everything, I can't believe it's the only way
       *
       * We could directly refresh the layers without regard to the actual value in show_labels, the style function picks it up, but that would mean even more useless api calls
       */
      const noise = show_annotators_identifiers;
      switch (show_labels) {
        default:
          Object.keys(annotationStatusFilters)
            .forEach((k) => {
              const annotationStatusFilter = annotationStatusFilters[k];
              if (annotationStatusFilter.activated) {
                this.userInteractions.refresh_source_by_status(annotationStatusFilter.text);
              }
            });
      }
    });
  }

  /**
   * Convenience factory function to create layers.
   */
  createVectorLayer(
    title: string,
    source: VectorSource,
    color: string,
    visible: boolean = true,
    zIndex: number = 99999999,
  ) {
    return new Vector({
      title,
      source,
      style: createStyleFunction(color, this.geoImageNetStore, this.taxonomyStore),
      visible,
      zIndex,
    });
  }

  /**
   * When handling clicks we sometimes need to get an aggregation of all features under the cursor.
   * This is a convenience wrapper around OL functionnality that does this.
   * @param event
   * @returns {Array}
   */
  aggregateFeaturesAtCursor(event: Event) {
    const features = [];
    this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
      features.push(feature);
    });
    return features;
  }

  getAggregatedFeatureIds(features: Feature[]) {
    const featureIds = [];
    features.forEach((f) => {
      if (f.getId() !== undefined) {
        featureIds.push(f.getId());
      }
    });
    return featureIds;
  }

  /**
   * OpenLayers allows us to register a single event handler for the click event on the map. From there, we need to infer
   * the user's intent and dispatch the click to relevant more specialized handlers.
   */
  receiveMapViewportClickEvent = (event: Event): void => {
    const features = this.aggregateFeaturesAtCursor(event);
    const featureIds = this.getAggregatedFeatureIds(features);

    switch (this.uiStore.selectedMode) {
      case MODE.VISUALIZATION:
        return navigateToClickedFeatureGroup(features, this.view);

      case MODE.DELETION:
        if (!(features.length > 0)) {
          return;
        }
        return this.userInteractions.delete_annotation_under_click(features, featureIds);

      case MODE.VALIDATION:
        if (!(features.length > 0)) {
          return;
        }
        return this.userInteractions.validate_features_under_click(features, featureIds);

      case MODE.REJECT:
        if (!(features.length > 0)) {
          return;
        }
        return this.userInteractions.reject_features_under_click(features, featureIds);

      case MODE.CREATION:
        return this.userInteractions.validate_creation_event_has_features();

      case MODE.ASK_EXPERTISE:
        if (!(features.length > 0)) {
          return;
        }
        return this.userInteractions.ask_expertise_for_features(featureIds, features);
    }
  };

  createVectorSource(features: Array<Feature>, status: string) {
    return new VectorSource({
      format: this.GeoJSONFormat,
      features,
      url: (extent) => {
        let baseUrl = `${this.geoserverURL}/wfs?service=WFS&`
          + `version=1.1.0&request=GetFeature&typeName=${this.annotationNamespace}:${this.annotationLayer}&`
          + 'outputFormat=application/json&srsname=EPSG:3857&'
          + `cql_filter=status='${status}' AND BBOX(geometry, ${extent.join(',')})`;
        if (this.CQLForTaxonomyClassId.length > 0) {
          baseUrl += ` AND ${this.CQLForTaxonomyClassId}`;
        } else {
          baseUrl += ' AND taxonomy_class_id IN (-1)';
        }
        if (this.CQLForOwnership.length > 0) {
          baseUrl += ` AND (${this.CQLForOwnership})`;
        }
        return baseUrl;
      },
      strategy: bbox,
    });
  }

  /**
   * There are numerous layers that need be created for the platform to give correct feedback to the user.
   * This should create all these layers and allow the layer switcher to switch through them.
   * @todo refactor this in smaller functions
   * @returns {Promise<void>}
   */
  async makeLayers() {
    const baseMaps = [];
    baseMaps.push(new TileLayer({
      title: 'OSM',
      type: 'base',
      source: new OSM(),
      zIndex: Z_INDEX.BASEMAP,
      visible: false,
    }));

    ALLOWED_BING_MAPS.forEach(function (bing_map) {
      baseMaps.push(new TileLayer({
        title: bing_map.title,
        type: 'base',
        preload: Infinity,
        source: new BingMaps({
          key: BING_API_KEY,
          imagerySet: bing_map.imagerySet,
        }),
        zIndex: Z_INDEX.BASEMAP,
        visible: bing_map.visible,
      }));
    });

    const NRG_layers = [];
    const RGB_layers = [];

    // Get map projection
    // const dst_epsg = this.map.getView().getProjection().getCode();
    const dst_epsg = 'EPSG:3857';
    const projectionExtent = getProjection(dst_epsg)
      .getExtent();
    const size = getWidth(projectionExtent) / 256;
    const n_tile_levels = 20;
    const resolutions = new Array(n_tile_levels);
    for (let z = 0; z < n_tile_levels; ++z) {
      // generate resolutions
      resolutions[z] = size / Math.pow(2, z);
    }
    const layer_names_zindex = {};
    try {
      const result = await geoserverCapabilities(`${this.geoserverURL}/wms?request=GetCapabilities&service=WMS&version=1.3.0`);
      const capability = result.Capability;
      capability.Layer.Layer.forEach((layer) => {
        if (layer.KeywordList.some((keyword) => keyword === 'GEOIMAGENET')) {
          // Get layer's extent
          let extent = projectionExtent;
          layer.BoundingBox.forEach((bbox) => {
            if (bbox.crs === 'EPSG:3857') {
              // extent is given as [minx, miny, maxx, maxy] by wms service
              // which is the same as OpenLayer requires
              extent = bbox.extent;
            }
          });
          let attribution = '';
          if (layer && layer.Attribution && layer.Attribution.Title) {
            attribution = layer.Attribution.Title;
          }
          const lyr = new TileLayer({
            title: layer.Name,
            type: CUSTOM_GEOIM_IMAGE_LAYER,
            source: new TileWMS({
              url: `${this.geoserverURL}/wms`,
              params: {
                LAYERS: layer.Name,
                TILED: true,
                FORMAT: 'image/png',
              },
              ratio: 1,
              projection: 'EPSG:3857',
              tileGrid: new TileGrid({
                origin: getTopLeft(projectionExtent),
                resolutions,
                tileSize: [256, 256],
              }),
              serverType: 'geoserver',
              crossOrigin: 'anonymous',
              attributions: attribution,
            }),
            extent,
          });

          // classify and sort layer based on its keywords
          const reg_date = /^\d{8}$/;
          layer.KeywordList.forEach((keyword) => {
            if (keyword === 'NRG') {
              NRG_layers.push(lyr);
            } else if (keyword === 'RGB') {
              RGB_layers.push(lyr);
            } else if (reg_date.test(keyword)) {
              // The date should be in the YYYYMMDD format
              // So newer images will be on top
              const zindex = parseInt(keyword, 10);
              lyr.setZIndex(zindex);
              layer_names_zindex[layer.Name] = zindex;
            }
          });

        }
      });
    } catch (e) {
      NotificationManager.error('We could not interrogate Geoserver capabilities. No images will be available.');
    }

    const bbox_features = new Collection();

    const contours_source = new VectorSource({
      format: this.GeoJSONFormat,
      url: (extent) => `${this.geoserverURL}/wfs?service=WFS&`
        + 'exceptions=application/json&request=GetFeature&'
        + 'typeNames=GeoImageNet:image&outputFormat=application/json&'
        + 'srsName=EPSG:3857&'
        + 'propertyName=id,sensor_name,bands,bits,filename,layer_name,trace_simplified&'
        + `cql_filter=BBOX(trace_simplified, ${extent.join(',')}) AND bands='RGB' AND bits=8`,
      features: bbox_features,
      strategy: bbox,
    });

    const styleFunction = (feature, resolution) => {
      if (resolution < 700) {
        const zIndex = layer_names_zindex[feature.get('layer_name')] || 99999999;
        return new Style({
          stroke: new Stroke({
            color: 'orange',
            width: 3,
          }),
          zIndex,
        });
      }
      return new Style();
    };
    const contours_layer = new VectorLayer({
      title: 'Image traces',
      source: contours_source,
      style: styleFunction,
      visible: true,
      zIndex: 0,
    });

    const bbox_source = new VectorSource({
      features: bbox_features,
    });
    let bbox_cluster_source = new Cluster({
      distance: 10,
      source: bbox_source,
      geometryFunction: feature => {
        return feature.getGeometry()
          .getInteriorPoint();
      }
    });

    const boundingBoxClusterLayer = new VectorLayer({
      source: bbox_cluster_source,
      title: 'Image Markers',
      style: (feature, resolution) => {
        const collectionLength = feature.get('features').length;
        if (resolution >= 700) {
          return new Style({
            image: new Circle({
              radius: 12,
              stroke: new Stroke({
                color: '#fff',
              }),
              fill: new Fill({
                color: '#3399CC',
              }),
            }),
            text: new Text({
              text: collectionLength.toString(),
              fill: new Fill({
                color: '#fff',
              }),
              font: '12px sans-serif',
            }),
          });
        }
        // don't display anything
        return new Style();
      },
      visible: true,
    });

    let contours_layers = [contours_layer, boundingBoxClusterLayer];

    const annotationLayers = [];
    // I have no idea what I am trying to have been doing here
    ANNOTATION_STATUS_AS_ARRAY.forEach((status) => {
      annotationLayers.unshift(this.geoImageNetStore.annotations_layers[status]);
    });

    const contours_group = new Group({
      title: 'BBOX',
      layers: contours_layers,
    });

    const RGB_group = new Group({
      title: 'RGB Images',
      layers: RGB_layers,
      combine: true,
      visible: false
    });
    const NRG_group = new Group({
      title: 'NRG Images',
      layers: NRG_layers,
      combine: true,
    });
    const base_maps_group = new Group({
      title: 'Base maps',
      layers: baseMaps,
    });
    const annotations_group = new Group({
      title: 'Annotations',
      layers: annotationLayers,
    });

    if (this.geoImageNetStore.acl.can(READ, WMS)) {
      this.map.addLayer(RGB_group);
      this.map.addLayer(NRG_group);
      this.map.addLayer(contours_group);
    }
    this.map.addLayer(base_maps_group);
    this.map.addLayer(annotations_group);

    this.map.addControl(this.layerSwitcher);
  }
}
