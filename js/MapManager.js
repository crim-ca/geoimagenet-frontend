import {autorun} from 'mobx';
import {Group, Vector} from 'ol/layer';
import {fromLonLat, transformExtent} from 'ol/proj';
import {MousePosition, ScaleLine} from 'ol/control';
import {Draw, Modify} from 'ol/interaction';
import {View, Collection, Feature, Map} from 'ol';
import {createStringXY} from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import {bbox} from 'ol/loadingstrategy';
import {Circle, Fill, Stroke, Style, Text} from 'ol/style';
import {GeoJSON} from 'ol/format';
import TileLayer from 'ol/layer/Tile';
import {BingMaps, Cluster, OSM, TileWMS} from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import {LayerSwitcher} from './layer-switcher';


import {
    MODE,
    ANNOTATION,
    BING_API_KEY,
    Z_INDEX,
    ANNOTATION_STATUS_AS_ARRAY,
    VISIBLE_LAYERS_BY_DEFAULT,
    ALLOWED_BING_MAPS,
    CUSTOM_GEOIM_IMAGE_LAYER,
    VIEW_CENTER, VALID_OPENLAYERS_ANNOTATION_RESOLUTION
} from './domain/constants';
import {notifier} from './utils/notifications';
import {
    create_geojson_feature,
    delete_annotations_request,
    geoserver_capabilities,
    modify_geojson_features,
    reject_annotations_request,
    validate_annotations_request
} from './domain/data-queries';
import {fromExtent} from 'ol/geom/Polygon';

const create_vector_layer = (title, source, color, visible = true) => {
    return new Vector({
        title: title,
        source: source,
        style: new Style({
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
            })
        }),
        visible: visible
    });
};

// To transform coordinates from a project to another
function transform(extent, src_epsg, dst_epsg) {
    return transformExtent(extent, src_epsg, dst_epsg);
}

const debounced = (delay, func) => {
    let timer_id;
    return (...args) => {
        if (timer_id) {
            clearTimeout(timer_id);
        }
        timer_id = setTimeout(() => {
            func(...args);
            timer_id = null;
        }, delay);
    };
};

export class MapManager {

    /*
    using arrow functions to bind the scope of member methods
    changing foo = () => {}; to foo = function() {} _will_ break things in interesting and unexpected ways
     */

    constructor(
        geoserver_url,
        annotation_namespace_uri,
        annotation_namespace,
        annotation_layer,
        map_div_id,
        state_proxy,
        store_actions
    ) {

        this.geoserver_url = geoserver_url;
        this.annotation_namespace = annotation_namespace;
        this.annotation_layer = annotation_layer;
        this.state_proxy = state_proxy;
        this.store_actions = store_actions;

        this.previous_mode = null;

        // bind class methods passed as event handlers to prevent the changed execution context from breaking class functionality
        this.draw_condition_callback = this.draw_condition_callback.bind(this);
        this.receive_drawend_event = this.receive_drawend_event.bind(this);
        this.receive_modifyend_event = this.receive_modifyend_event.bind(this);
        this.receive_map_viewport_click_event = this.receive_map_viewport_click_event.bind(this);
        this.receive_resolution_change_event = this.receive_resolution_change_event.bind(this);

        this.view = new View({
            center: fromLonLat(VIEW_CENTER.CENTRE),
            zoom: VIEW_CENTER.ZOOM_LEVEL
        });

        this.map = new Map({
            target: map_div_id,
            view: this.view,
        });

        this.map.addControl(new ScaleLine());
        this.map.getView().on('change:resolution', debounced(200, this.receive_resolution_change_event));

        const style = getComputedStyle(document.body);

        ANNOTATION_STATUS_AS_ARRAY.forEach(status => {

            const color = style.getPropertyValue(`--color-${status}`);
            this.store_actions.set_annotation_collection(status, new Collection());
            this.store_actions.set_annotation_source(status, this.create_vector_source(this.state_proxy.annotations_collections[status], status));

            const this_layer_is_visible = VISIBLE_LAYERS_BY_DEFAULT.indexOf(status) > -1;
            const vectorLayer = create_vector_layer(status, this.state_proxy.annotations_sources[status], color, this_layer_is_visible);

            this.store_actions.set_annotation_layer(status, vectorLayer);
        });

        this.modify = new Modify({
            features: this.state_proxy.annotations_collections[ANNOTATION.STATUS.NEW],
        });
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
            if (this.state_proxy.visible_classes.length > 0) {
                this.cql_filter = `taxonomy_class_id IN (${this.state_proxy.visible_classes.join(',')})`;
            } else {
                this.cql_filter = '';
            }
            ANNOTATION_STATUS_AS_ARRAY.forEach(s => {
                this.refresh_source_by_status(s);
            });
        });

        this.cql_filter = '';

        // We set the layers and the layer switcher here
        this.make_layers();

        this.mouse_position = new MousePosition({
            coordinateFormat: createStringXY(4),
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

    refresh_source_by_status(status) {
        this.state_proxy.annotations_sources[status].clear();
        this.state_proxy.annotations_sources[status].refresh(true);
    }

    draw_condition_callback(event) {

        /*
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
                notifier.warning('All corners of an annotation polygon must be on an image.');
                return false;
            }
            notifier.warning('You must select an image to begin creating annotations.');
            return false;
        }

        const first_layer = layers[layer_index];

        if (this.state_proxy.current_annotation.initialized) {
            if (first_layer.get('title') === this.state_proxy.current_annotation.image_title) {
                return true;
            }
            notifier.warning('Annotations must be made on a single image, make sure that all polygon points are on the same image.');
            return false;
        }

        this.store_actions.start_annotation(first_layer.get('title'));

        return true;
    }

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

    async receive_drawend_event(event) {

        const feature = event.feature;
        feature.setProperties({
            taxonomy_class_id: this.state_proxy.selected_taxonomy_class_id,
            annotator_id: 1,
            image_name: this.state_proxy.current_annotation.image_title,
        });
        const payload = this.formatGeoJson.writeFeature(feature);

        try {
            const new_feature_id = await create_geojson_feature(payload);
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
            await modify_geojson_features(payload);
        } catch (error) {
            MapManager.geojsonLogError(error);
        }

    }

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

    async receive_map_viewport_click_event(event) {
        const features = this.aggregate_features_at_cursor(event);
        const feature_ids = this.get_aggregated_feature_ids(features);

        switch (this.state_proxy.mode) {

            case MODE.VISUALIZE:
                features.forEach(f => {
                    // cluster source features regroup all individual features in one
                    if (f.get('features')) {
                        const actual_features = f.get('features');
                        console.log(actual_features);
                        const extent = actual_features[0].get('geometry').getExtent();
                        const x = extent[0] + (extent[2] - extent[0]) / 2;
                        const y = extent[1] + (extent[3] - extent[1]) / 2;
                        this.view.animate({center: [x, y]}, {resolution: VALID_OPENLAYERS_ANNOTATION_RESOLUTION - 0.0001});
                    }
                });
                break;

            case MODE.DELETE:
                await notifier.confirm(`Do you really want to delete the highlighted feature?`);
                try {
                    await delete_annotations_request(feature_ids);
                } catch (error) {
                    MapManager.geojsonLogError(error);
                }
                features.forEach(f => {
                    this.state_proxy.annotations_sources[ANNOTATION.STATUS.NEW].removeFeature(f);
                });
                break;

            case MODE.VALIDATE:
                try {
                    await validate_annotations_request(feature_ids);
                } catch (error) {
                    MapManager.geojsonLogError(error);
                }
                this.refresh_source_by_status(ANNOTATION.STATUS.RELEASED);
                this.refresh_source_by_status(ANNOTATION.STATUS.VALIDATED);
                break;

            case MODE.REJECT:
                try {
                    await reject_annotations_request(feature_ids);
                } catch (error) {
                    MapManager.geojsonLogError(error);
                }
                this.refresh_source_by_status(ANNOTATION.STATUS.RELEASED);
                this.refresh_source_by_status(ANNOTATION.STATUS.REJECTED);
                break;

            case MODE.CREATION:
                if (this.state_proxy.selected_taxonomy_class_id === -1) {
                    notifier.warning('You must select a taxonomy class to begin annotating content.');
                }
                break;
        }
    }

    create_vector_source(features, status) {
        return new VectorSource({
            format: new GeoJSON(),
            features: features,
            url: () => {
                if (this.cql_filter.length > 0) {
                    return `${this.geoserver_url}/wfs?service=WFS&` +
                        `version=1.1.0&request=GetFeature&typeName=${this.annotation_namespace}:${this.annotation_layer}&` +
                        `outputFormat=application/json&srsname=EPSG:3857&cql_filter=status='${status}' AND ${this.cql_filter}`;
                }
                return `${this.geoserver_url}/wfs?service=WFS&` +
                    `version=1.1.0&request=GetFeature&typeName=${this.annotation_namespace}:${this.annotation_layer}&` +
                    `outputFormat=application/json&srsname=EPSG:3857&cql_filter=status='${status}' AND taxonomy_class_id IN (-1)`;
            },
            strategy: bbox
        });
    }

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

        try {
            const result = await geoserver_capabilities(`${GEOSERVER_URL}/wms?request=GetCapabilities&service=WMS&version=1.3.0`);
            const capability = result.Capability;
            const layers_info = capability.Layer.Layer;
            for (let i = 0; i < layers_info.length; i++) {
                const layer_name = layers_info[i].Name;
                const src_proj = layers_info[i].BoundingBox[1].crs;
                // Get layer's extent
                let extent = layers_info[i].BoundingBox[1].extent;
                // The coordinates must be reordered for Openlayers
                const extent_for_OL = [extent[1], extent[0], extent[3], extent[2]];
                const layer_base_name = layer_name.split(":")[1];

                if (layer_name.includes('GeoImageNet:NRG')) {
                    // The coordinates must be set to the same projection as the map
                    let extent = transform(extent_for_OL, src_proj, dst_epsg);
                    const lyr = new TileLayer({
                        title: layer_base_name,
                        type: CUSTOM_GEOIM_IMAGE_LAYER,
                        source: new TileWMS({
                            url: `${GEOSERVER_URL}/GeoImageNet/wms`,
                            params: {'LAYERS': layer_name},
                            ratio: 1,
                            serverType: 'geoserver',
                            crossOrigin: 'anonymous',
                        }),
                        extent: extent,
                    });
                    NRG_layers.push(lyr);
                }

                if (layer_name.includes('GeoImageNet:RGB')) {
                    // The coordinates must be set to the same projection as the map
                    let extent = transform(extent_for_OL, src_proj, dst_epsg);
                    const lyr = new TileLayer({
                        title: layer_base_name,
                        type: CUSTOM_GEOIM_IMAGE_LAYER,
                        source: new TileWMS({
                            url: `${GEOSERVER_URL}/GeoImageNet/wms`,
                            params: {'LAYERS': layer_name},
                            ratio: 1,
                            serverType: 'geoserver',
                            crossOrigin: 'anonymous',
                        }),
                        extent: extent,
                    });
                    RGB_layers.push(lyr);
                }
            }
        } catch (e) {
            notifier.error('We could not interrogate Geoserver capabilities. No images will be available.');
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

        try {
            const result_for_bbox = await geoserver_capabilities(`${GEOSERVER_URL}/GeoImageNet/wms?request=GetCapabilities`);
            result_for_bbox['Capability']['Layer']['Layer'].forEach(layer => {
                // EX_GeographicBoundingBox is an array of [minx, miny, maxx, maxy] in EPSG:4326
                let extent = new fromExtent(layer['EX_GeographicBoundingBox']);
                extent.transform("EPSG:4326", "EPSG:3857");
                let maxArea = 10000000000; // if the extent is to large (most likely the world), don't display it
                if (extent.getArea() < maxArea) {
                    let feature = new Feature({
                        geometry: extent
                    });
                    bboxFeatures.push(feature);
                }
            });
        } catch (e) {
            notifier.error('We could no interrogate Geoserver capabilities. The image marker layer will be unavailable.');
        }


        const annotation_layers = [];
        ANNOTATION_STATUS_AS_ARRAY.forEach((status) => {
            annotation_layers.unshift(this.state_proxy.annotations_layers[status]);
        });

        const RGB_group = new Group({
            title: 'RGB Images',
            layers: RGB_layers,
        });
        const NRG_group = new Group({
            title: 'NRG Images',
            layers: NRG_layers,
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

        const base_maps_object = {
            "Base Maps": base_maps_group
        };
        const overlay_maps = {
            "RGB": RGB_group,
            "NRG": NRG_group,
            "Image markers": image_markers_group,
            "Annotations": annotations_group,
        };

        this.layerSwitcher = new LayerSwitcher({
            target: 'layer-switcher',
            open: true,
        });
        this.map.addControl(this.layerSwitcher);
        this.layerSwitcher.showPanel();
        this.layerSwitcher.onmouseover = null;

    }

    static async geojsonLogError(error) {
        const text = await error.text();
        notifier.error(text);
    }


}
