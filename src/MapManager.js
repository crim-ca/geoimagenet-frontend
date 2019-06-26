import {autorun} from 'mobx';

import {Group, Vector} from 'ol/layer';
import {fromLonLat, get as getProjection} from 'ol/proj';
import {MousePosition, ScaleLine} from 'ol/control';
import {Draw, Modify} from 'ol/interaction';
import {View, Collection, Feature, Map} from 'ol';
import {toStringHDMS} from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import {bbox} from 'ol/loadingstrategy';
import {Circle, Fill, Stroke, Style, Text} from 'ol/style';
import {GeoJSON} from 'ol/format';
import TileLayer from 'ol/layer/Tile';
import {BingMaps, Cluster, OSM, TileWMS} from 'ol/source';
import TileGrid from 'ol/tilegrid/TileGrid';
import VectorLayer from 'ol/layer/Vector';
import {fromExtent} from 'ol/geom/Polygon';
import {boundingExtent, buffer, getArea, getWidth, getTopLeft, getCenter} from 'ol/extent';

import {
    MODE,
    ANNOTATION,
    BING_API_KEY,
    Z_INDEX,
    ANNOTATION_STATUS_AS_ARRAY,
    ALLOWED_BING_MAPS,
    CUSTOM_GEOIM_IMAGE_LAYER,
    VIEW_CENTER, VALID_OPENLAYERS_ANNOTATION_RESOLUTION
} from './domain/constants.js';
import {notifier} from './utils/notifications.js';
import {debounced} from './utils/event_handling.js';
import {NotificationManager} from 'react-notifications';

/**
 * The MapManager is responsible for handling map behaviour at the boundary between the platform and OpenLayers.
 * It should listen to specific OL events and trigger domain interactions in accordance.
 */
export class MapManager {

    /**
     using arrow functions to bind the scope of member methods
     changing foo = () => {}; to foo = function() {} _will_ break things in interesting and unexpected ways
     */

    /**
     * @public
     * @param {String} geoserver_url
     * @param {String} annotation_namespace_uri
     * @param {String} annotation_namespace
     * @param {String} annotation_layer
     * @param {String} map_div_id
     * @param {Object} state_proxy
     * @param {StoreActions} store_actions
     * @param {DataQueries} data_queries
     * @param {LayerSwitcher} layer_switcher
     */
    constructor(
        geoserver_url,
        annotation_namespace_uri,
        annotation_namespace,
        annotation_layer,
        map_div_id,
        state_proxy,
        store_actions,
        data_queries,
        layer_switcher
    ) {

        /**
         * The deployment's Geoserver endpoint
         * @private
         * @type {String}
         */
        this.geoserver_url = geoserver_url;
        /**
         * Geoserver classifies annotations in namespaces, we need it to construct urls.
         * @private
         * @type {String}
         */
        this.annotation_namespace = annotation_namespace;
        /**
         * While for the user an annotation represents an instance of a taxonomy class on an image, for the platform
         * it is actually a feature on an OpenLayers layer. Our features are served from a Geoserver instance,
         * and this property should contain the layer mounted on Geoserver that contains our annotations.
         * @private
         * @type {String}
         */
        this.annotation_layer = annotation_layer;
        /**
         * We use MobX as state manager, this is our top level mobx observable store.
         * @private
         * @type {Object}
         */
        this.state_proxy = state_proxy;
        /**
         * @private
         * @type {StoreActions}
         */
        this.store_actions = store_actions;
        /**
         * @private
         * @type {DataQueries}
         */
        this.data_queries = data_queries;

        /**
         * @type {LayerSwitcher}
         */
        this.layer_switcher = layer_switcher;

        this.previous_mode = null;

        // bind class methods passed as event handlers to prevent the changed execution context from breaking class functionality
        this.draw_condition_callback = this.draw_condition_callback.bind(this);
        this.receive_drawend_event = this.receive_drawend_event.bind(this);
        this.receive_modifyend_event = this.receive_modifyend_event.bind(this);
        this.receive_map_viewport_click_event = this.receive_map_viewport_click_event.bind(this);
        this.receive_resolution_change_event = this.receive_resolution_change_event.bind(this);

        /**
         * Reference to the OL View object.
         * @private
         * @type {View}
         */
        this.view = new View({
            center: fromLonLat(VIEW_CENTER.CENTRE),
            zoom: VIEW_CENTER.ZOOM_LEVEL
        });

        /**
         * Reference to the OL map instance.
         * @private
         * @type {Map}
         */
        this.map = new Map({
            target: map_div_id,
            view: this.view,
            loadTilesWhileAnimating: true,
            loadTilesWhileInteracting: true,
            pixelRatio: 1,
        });

        this.map.addControl(new ScaleLine());
        this.map.getView().on('change:resolution', debounced(200, this.receive_resolution_change_event));

        const style = getComputedStyle(document.body);

        const {annotation_status_list, annotations_collections, annotations_sources} = this.state_proxy;

        Object.keys(annotation_status_list).forEach(key => {
            const {activated} = annotation_status_list[key];

            const color = style.getPropertyValue(`--color-${key}`);
            this.store_actions.set_annotation_collection(key, new Collection());
            this.store_actions.set_annotation_source(key, this.create_vector_source(annotations_collections[key], key));

            const vectorLayer = this.create_vector_layer(key, annotations_sources[key], color, activated);

            this.store_actions.set_annotation_layer(key, vectorLayer);
        });

        /**
         * Map interaction to modify existing annotations. To be disabled when zoomed out too far.
         * @private
         * @type {Modify}
         */
        this.modify = new Modify({
            features: this.state_proxy.annotations_collections[ANNOTATION.STATUS.NEW],
        });
        /**
         * Map interaction to create new annotations. To be disabled when zoomed out too far.
         * @private
         * @type {Draw}
         */
        this.draw = new Draw({
            source: this.state_proxy.annotations_sources[ANNOTATION.STATUS.NEW],
            type: 'Polygon',
            condition: this.draw_condition_callback
        });

        this.draw.on('drawend', this.receive_drawend_event);
        this.modify.on('modifyend', this.receive_modifyend_event);

        this.state_proxy.annotations_collections[ANNOTATION.STATUS.NEW].on('add', (e) => {
            e.element.revision_ = 0;
        });

        autorun(() => {
            const {annotation_status_list} = this.state_proxy;

            const visible = [];
            Object.keys(this.state_proxy.flat_taxonomy_classes).forEach(k => {
                /** @var {TaxonomyClass} taxonomy_class */
                const taxonomy_class = this.state_proxy.flat_taxonomy_classes[k];
                if (taxonomy_class.visible) {
                    visible.push(taxonomy_class.id);
                }
            });

            if (visible.length > 0) {
                this.cql_filter = `taxonomy_class_id IN (${visible.join(',')})`;
            } else {
                this.cql_filter = '';
            }
            const status_list = [];
            Object.keys(annotation_status_list).forEach(k => {
                const status = annotation_status_list[k];
                if (status.activated) {
                    status_list.push(status.text);
                }
            });
            status_list.forEach(s => {
                this.refresh_source_by_status(s);
            });
        });

        this.cql_filter = '';

        // We set the layers and the layer switcher here
        this.make_layers();

        this.mouse_position = new MousePosition({
            coordinateFormat: toStringHDMS,
            projection: 'EPSG:4326',
            undefinedHTML: '&nbsp;',
            target: 'coordinates',
        });
        this.map.addControl(this.mouse_position);

        this.map.addEventListener('click', this.receive_map_viewport_click_event);

        this.formatGeoJson = new GeoJSON({
            dataProjection: 'EPSG:3857',
            featureProjection: 'EPSG:3857',
            geometryName: 'geometry',
        });

        autorun(() => {
            const {show_labels, annotation_status_list} = this.state_proxy;
            /**
             * This clunky switch is used so that MobX registers the access to the show_labels property.
             * We could directly refresh the layers without regard to the actual value in show_labels, the style function picks it up.
             */
            switch (show_labels) {
                default:
                    Object.keys(annotation_status_list).forEach(k => {
                        const annotation_status = annotation_status_list[k];
                        if (annotation_status.activated) {
                            this.refresh_source_by_status(annotation_status.text);
                        }
                    });
            }
        });

        autorun(() => {
            switch (this.state_proxy.mode) {
                case MODE.CREATION:
                    if (this.state_proxy.selected_taxonomy_class_id > 0) {
                        this.map.addInteraction(this.draw);
                    }
                    this.map.removeInteraction(this.modify);
                    break;
                case MODE.MODIFY:
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
     * Convenience factory function to create layers.
     * @private
     * @param {String} title
     * @param {VectorSource} source
     * @param {String} color
     * @param {boolean} visible
     * @param {Number} zIndex The default is 99999999 because image layers are ordered by their observation date (20190202)
     * @returns {VectorLayer}
     *
     * @todo maybe at some point rethink the ordering of the layers but so far it's not problematic
     */
    create_vector_layer(title, source, color, visible = true, zIndex = 99999999) {

        const style_function = (feature, resolution) => {
            const {show_labels} = this.state_proxy;
            const taxonomy_class = this.state_proxy.flat_taxonomy_classes[feature.get('taxonomy_class_id')];
            const label = taxonomy_class.name_en || taxonomy_class.name_fr;
            return new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.25)',
                }),
                stroke: new Stroke({
                    color: color,
                    width: 2
                }),
                image: new Circle({
                    radius: 7,
                    fill: new Fill({
                        color: color,
                    })
                }),
                text: new Text({
                    font: '16px Calibri, sans-serif',
                    fill: new Fill({color: '#000'}),
                    stroke: new Stroke({color: '#FFF', width: 2}),
                    text: show_labels ? (resolution > 100 ? '' : label) : '',
                    overflow: true,
                }),
            });
        };

        return new Vector({
            title: title,
            source: source,
            style: style_function,
            visible: visible,
            zIndex: zIndex
        });
    }

    /**
     * Some actions need to redraw the annotations on the viewport. This method clears then refreshes the features on the specified layer.
     * @param {String} status
     */
    refresh_source_by_status(status) {
        this.state_proxy.annotations_sources[status].clear();
        this.state_proxy.annotations_sources[status].refresh(true);
    }

    /**
     * When in annotation mode, we need some kind of control over the effect of each click.
     * This callback should check domain conditions for the click to be valid and return a boolean to that effect.
     * Domain prevalidation of annotations should happen here.
     * @private
     * @param event
     * @returns {boolean}
     */
    draw_condition_callback(event) {

        /**
         make sure that each click is correct to create the annotation

         if we are the first click, only verify that we are over an image layer
         if we are clicks afterwards, verify that we are over the same image
         */

        let layer_index = -1;

        const layers = [];
        this.map.forEachLayerAtPixel(event.pixel, l => {
            layers.push(l);
        });

        const at_least_one_layer_is_an_image = (element, index) => {
            const layer_is_image = element.get('type') === CUSTOM_GEOIM_IMAGE_LAYER;
            if (layer_is_image) {
                layer_index = index;
                return true;
            }
            return false;
        };

        if (!layers.some(at_least_one_layer_is_an_image)) {
            if (this.state_proxy.current_annotation.initialized) {
                NotificationManager.warning('All corners of an annotation polygon must be on an image.');
                return false;
            }
            NotificationManager.warning('You must select an image to begin creating annotations.');
            return false;
        }

        const first_layer = layers[layer_index];

        if (this.state_proxy.current_annotation.initialized) {
            if (first_layer.get('title') === this.state_proxy.current_annotation.image_title) {
                return true;
            }
            NotificationManager.warning('Annotations must be made on a single image, make sure that all polygon points are on the same image.');
            return false;
        }

        this.store_actions.start_annotation(first_layer.get('title'));

        return true;
    }

    /**
     * When changing resolution we need to activate or deactivate user annotation. That is because after a certain distance,
     * objects are way too tiny on the screen to create a meaningful annotation.
     * @private
     * @param event
     */
    receive_resolution_change_event(event) {
        const resolution = event.target.get('resolution');
        if (resolution < VALID_OPENLAYERS_ANNOTATION_RESOLUTION) {
            this.store_actions.activate_actions();
            if (this.previous_mode !== null) {
                this.store_actions.set_mode(this.previous_mode);
                this.previous_mode = null;
            }
        } else {
            this.store_actions.deactivate_actions();
            if (this.state_proxy.mode !== MODE.VISUALIZE) {
                this.previous_mode = this.state_proxy.mode;
                this.store_actions.set_mode(MODE.VISUALIZE);
            }
        }
    }

    /**
     * Launch the creation of a new annotation. This should also update the "new" annotations count of the relevant
     * taxonomy class.
     * @private
     * @param event
     * @returns {Promise<void>}
     */
    async receive_drawend_event(event) {

        const feature = event.feature;
        feature.setProperties({
            taxonomy_class_id: this.state_proxy.selected_taxonomy_class_id,
            annotator_id: 1,
            image_name: this.state_proxy.current_annotation.image_title,
        });
        const payload = this.formatGeoJson.writeFeature(feature);

        try {
            const new_feature_id = await this.data_queries.create_geojson_feature(payload);
            feature.setId(`${this.annotation_layer}.${new_feature_id}`);
            this.store_actions.increment_new_annotations_count(this.state_proxy.selected_taxonomy_class_id);
        } catch (error) {
            MapManager.geojsonLogError(error);
        }

        this.store_actions.end_annotation();
    }

    async receive_modifyend_event(event) {

        const modifiedFeatures = [];
        event.features.forEach((feature) => {
            if (feature.revision_ >= 1) {
                modifiedFeatures.push(feature);
                feature.revision_ = 0;
            }
        });
        const payload = this.formatGeoJson.writeFeatures(modifiedFeatures);

        try {
            await this.data_queries.modify_geojson_features(payload);
        } catch (error) {
            MapManager.geojsonLogError(error);
        }

    }

    /**
     * When handling clicks we sometimes need to get an aggregation of all features under the cursor.
     * This is a convenience wrapper around OL functionnality that does this.
     * @param event
     * @returns {Array}
     */
    aggregate_features_at_cursor(event) {
        const features = [];
        this.map.forEachFeatureAtPixel(event.pixel, feature => {
            features.push(feature);
        });
        return features;
    }

    get_aggregated_feature_ids(features) {
        const feature_ids = [];
        features.forEach(f => {
            if (f.getId() !== undefined) {
                feature_ids.push(f.getId());
            }
        });
        return feature_ids;
    }

    /**
     * This is the general click management event handler. Depending on a lot of factors,
     * this will dispatch the click to various handlers and actions.
     * @private
     * @param event
     * @returns {Promise<void>}
     */
    async receive_map_viewport_click_event(event) {
        const features = this.aggregate_features_at_cursor(event);
        const feature_ids = this.get_aggregated_feature_ids(features);

        switch (this.state_proxy.mode) {

            case MODE.VISUALIZE:
                features.forEach(global_feature_layer => {
                    // cluster source features regroup all individual features in one
                    if (global_feature_layer.get('features')) {
                        const actual_features = global_feature_layer.get('features');

                        const coords = [];
                        if (actual_features.length > 1) {
                            actual_features.forEach(single_feature => {
                                const extent = single_feature.get('geometry').getExtent();
                                const min = [extent[0], extent[1]];
                                const max = [extent[2], extent[3]];
                                coords.push(min);
                                coords.push(max);
                            });
                            const bounding_extent = new boundingExtent(coords);
                            const buffered_extent = new buffer(bounding_extent, 100);
                            this.view.fit(buffered_extent, {
                                duration: 1000
                            });
                        } else {
                            const extent = actual_features[0].get('geometry').getExtent();
                            this.view.animate({
                                center: getCenter(extent),
                                resolution: VALID_OPENLAYERS_ANNOTATION_RESOLUTION - 0.0001,
                                duration: 1000
                            });
                        }
                    }
                });
                break;

            case MODE.DELETE:
                await notifier.confirm(`Do you really want to delete the highlighted feature?`);
                try {
                    await this.data_queries.delete_annotations_request(feature_ids);
                } catch (error) {
                    MapManager.geojsonLogError(error);
                }
                features.forEach(f => {
                    this.state_proxy.annotations_sources[ANNOTATION.STATUS.NEW].removeFeature(f);
                });
                break;

            case MODE.VALIDATE:
                try {
                    await this.data_queries.validate_annotations_request(feature_ids);
                } catch (error) {
                    MapManager.geojsonLogError(error);
                }
                this.refresh_source_by_status(ANNOTATION.STATUS.RELEASED);
                this.refresh_source_by_status(ANNOTATION.STATUS.VALIDATED);
                break;

            case MODE.REJECT:
                try {
                    await this.data_queries.reject_annotations_request(feature_ids);
                } catch (error) {
                    MapManager.geojsonLogError(error);
                }
                this.refresh_source_by_status(ANNOTATION.STATUS.RELEASED);
                this.refresh_source_by_status(ANNOTATION.STATUS.REJECTED);
                break;

            case MODE.CREATION:
                if (this.state_proxy.selected_taxonomy_class_id === -1) {
                    NotificationManager.warning('You must select a taxonomy class to begin annotating content.');
                }
                break;
        }
    }

    /**
     *
     * @param features
     * @param status
     * @returns {VectorSource}
     */
    create_vector_source(features, status) {
        return new VectorSource({
            format: new GeoJSON(),
            features: features,
            url: (extent) => {
                let baseUrl = `${this.geoserver_url}/wfs?service=WFS&` +
                    `version=1.1.0&request=GetFeature&typeName=${this.annotation_namespace}:${this.annotation_layer}&` +
                    `outputFormat=application/json&srsname=EPSG:3857&` +
                    `cql_filter=status='${status}' AND BBOX(geometry, ${extent.join(',')})`;
                if (this.cql_filter.length > 0) {
                    baseUrl += ` AND ${this.cql_filter}`;
                } else {
                    baseUrl += ` AND taxonomy_class_id IN (-1)`;
                }
                return baseUrl;
            },
            strategy: bbox
        });
    }

    /**
     * There are numerous layers that need be created for the platform to give correct feedback to the user.
     * This should create all these layers and allow the layer switcher to switch through them.
     * @todo refactor this in smaller functions
     * @returns {Promise<void>}
     */
    async make_layers() {

        const base_maps = [];
        base_maps.push(new TileLayer({
            title: 'OSM',
            type: 'base',
            source: new OSM(),
            zIndex: Z_INDEX.BASEMAP,
            visible: false,
        }));

        ALLOWED_BING_MAPS.forEach(function (bing_map) {
            base_maps.push(new TileLayer({
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
        let projectionExtent = getProjection(dst_epsg).getExtent();
        let size = getWidth(projectionExtent) / 256;
        let n_tile_levels = 20;
        let resolutions = new Array(n_tile_levels);
        for (let z = 0; z < n_tile_levels; ++z) {
            // generate resolutions
            resolutions[z] = size / Math.pow(2, z);
        }
        try {
            const result = await this.data_queries.geoserver_capabilities(`${this.geoserver_url}/wms?request=GetCapabilities&service=WMS&version=1.3.0`);
            const capability = result.Capability;
            capability.Layer.Layer.forEach(layer => {
                if (layer.KeywordList.some(keyword => keyword === 'GEOIMAGENET')) {

                    // Get layer's extent
                    let extent = projectionExtent;
                    layer.BoundingBox.forEach(bbox => {
                        if (bbox.crs === 'EPSG:3857') {
                            // extent is given as [minx, miny, maxx, maxy] by wms service
                            // which is the same as OpenLayer requires
                            extent = bbox.extent;
                        }
                    });
                    let attribution = "";
                    if (layer && layer.Attribution && layer.Attribution.Title) {
                        attribution = layer.Attribution.Title;
                    }
                    const lyr = new TileLayer({
                        title: layer.Name,
                        type: CUSTOM_GEOIM_IMAGE_LAYER,
                        source: new TileWMS({
                            url: `${this.geoserver_url}/wms`,
                            params: {'LAYERS': layer.Name, 'TILED': true, 'FORMAT': 'image/png'},
                            ratio: 1,
                            projection: 'EPSG:3857',
                            tileGrid: new TileGrid({
                                origin: getTopLeft(projectionExtent),
                                resolutions: resolutions,
                                tileSize: [256, 256],
                            }),
                            serverType: 'geoserver',
                            crossOrigin: 'anonymous',
                            attributions: attribution,
                        }),
                        extent: extent,
                    });

                    // classify and sort layer based on its keywords
                    let reg_date = /^\d{8}$/;
                    layer.KeywordList.forEach(keyword => {
                        if (keyword === 'NRG') {
                            NRG_layers.push(lyr);
                        } else if (keyword === 'RGB') {
                            RGB_layers.push(lyr);
                        } else if (reg_date.test(keyword)) {
                            // The date should be in the YYYYMMDD format
                            // So newer images will be on top
                            lyr.setZIndex(parseInt(keyword));
                        }
                    });

                }
            });
        } catch (e) {
            NotificationManager.error('We could not interrogate Geoserver capabilities. No images will be available.');
        }


        let bboxFeatures = new Collection();
        let bboxSource = new VectorSource({
            features: bboxFeatures
        });
        let bboxClusterSource = new Cluster({
            distance: 10,
            source: bboxSource,
            geometryFunction: feature => {
                return feature.getGeometry().getInteriorPoint();
            }
        });
        let zoomedInStyle = new Style({
            stroke: new Stroke({
                color: 'orange',
                width: 3
            }),
            fill: new Fill({
                color: 'rgba(255, 165, 0, 0.3)'
            }),
            geometry: function (feature) {
                let originalFeature = feature.get('features');
                return originalFeature[0].getGeometry();
            }
        });

        let bboxClusterLayer = new VectorLayer({
            source: bboxClusterSource,
            title: 'Image Markers',
            style: (feature, resolution) => {
                let size = feature.get('features').length;
                if (resolution < 25) {
                    // don't display anything
                    return new Style();
                } else if (resolution > 700) {
                    return new Style({
                        image: new Circle({
                            radius: 12,
                            stroke: new Stroke({
                                color: '#fff'
                            }),
                            fill: new Fill({
                                color: '#3399CC'
                            })
                        }),
                        text: new Text({
                            text: size.toString(),
                            fill: new Fill({
                                color: '#fff'
                            }),
                            font: '12px sans-serif'
                        })
                    });
                } else {
                    return zoomedInStyle;
                }
            },
            visible: true,
        });

        // TODO there is a hard client requirement that every NRG or RGB image has their counterpart of either type
        // as such, here I take a shortcut and only loop over one of the layers to create the image markers
        // should that requirement ever change, some logic and autorun magic should be added to regenerate the image markers layer
        // when we select either type of images
        const maxArea = 10 ** 13; // if the extent is to large (most likely the world), don't display it
        NRG_layers.forEach(layer => {
            let extent = layer.get('extent');
            let area = getArea(extent);
            if (area < maxArea) {
                let feature = new Feature({
                    geometry: fromExtent(extent)
                });
                bboxFeatures.push(feature);
            }
        });


        const annotation_layers = [];
        ANNOTATION_STATUS_AS_ARRAY.forEach((status) => {
            annotation_layers.unshift(this.state_proxy.annotations_layers[status]);
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
        const image_markers_group = new Group({
            title: 'Image Markers',
            layers: [bboxClusterLayer],
        });
        const base_maps_group = new Group({
            title: 'Base maps',
            layers: base_maps,
        });
        const annotations_group = new Group({
            title: 'Annotations',
            layers: annotation_layers,
        });

        this.map.addLayer(RGB_group);
        this.map.addLayer(NRG_group);
        this.map.addLayer(image_markers_group);
        this.map.addLayer(base_maps_group);
        this.map.addLayer(annotations_group);

        this.map.addControl(this.layer_switcher);

    }

    /**
     * @private
     * @param error
     * @returns {Promise<void>}
     */
    static async geojsonLogError(error) {
        const text = await error.text();
        NotificationManager.error(text);
    }


}
