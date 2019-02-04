import {
    MODE,
    ANNOTATION,
    IMAGES_NRG,
    IMAGES_RGB, BING_API_KEY,
    Z_INDEX,
} from './constants.js';
import {store, set_annotation_collection, set_annotation_source, set_annotation_layer} from './store.js';
import {notifier} from './utils/notifications.js'
import {create_geojson_feature, delete_geojson_feature, modify_geojson_features} from './data-queries.js';

const create_vector_layer = (title, source, color) => {
    return new ol.layer.Vector({
        title: title,
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.25)',
            }),
            stroke: new ol.style.Stroke({
                color: color,
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: color,
                })
            })
        })
    });
};

export class MapManager {

    /*
    using arrow functions to bind the scope of member methods
    changing foo = () => {}; to foo = function() {} _will_ break things in interesting and unexpected ways
     */

    static refresh() {
        store.annotations_sources[ANNOTATION.STATUS.NEW].clear();
        store.annotations_sources[ANNOTATION.STATUS.NEW].refresh(true);
        store.annotations_sources[ANNOTATION.STATUS.RELEASED].clear();
        store.annotations_sources[ANNOTATION.STATUS.RELEASED].refresh(true);
    }

    constructor(geoserver_url, annotation_namespace_uri, annotation_namespace, annotation_layer, map_div_id) {

        this.geoserver_url = geoserver_url;
        this.annotation_namespace = annotation_namespace;
        this.annotation_layer = annotation_layer;

        // bind class methods passed as event handlers to prevent the changed execution context from breaking class functionality
        this.receive_drawend_event = this.receive_drawend_event.bind(this);
        this.receive_modifyend_event = this.receive_modifyend_event.bind(this);
        this.receive_map_viewport_click_event = this.receive_map_viewport_click_event.bind(this);

        const style = getComputedStyle(document.body);

        // Initialize empty collections for each annotation status so we can hold references to them in the global store
        Object.keys(ANNOTATION.STATUS).forEach(key => {
            const status = ANNOTATION.STATUS[key];
            const color = style.getPropertyValue(`--color-${status}`);
            set_annotation_collection(status, new ol.Collection());
            set_annotation_source(status, this.create_vector_source(store.annotations_collections[status], status));
            set_annotation_layer(status, create_vector_layer(status, store.annotations_sources[status], color));
        });

        this.modify = new ol.interaction.Modify({
            features: store.annotations_collections[ANNOTATION.STATUS.NEW],
        });
        this.draw = new ol.interaction.Draw({
            source: store.annotations_sources[ANNOTATION.STATUS.NEW],
            type: 'Polygon',
        });

        this.draw.on('drawend', this.receive_drawend_event);
        this.modify.on('modifyend', this.receive_modifyend_event);

        store.annotations_collections[ANNOTATION.STATUS.NEW].on('add', (e) => {
            e.element.revision_ = 0;
        });

        mobx.autorun(() => {
            // create the cql filter from detail elements
            // prepend each bit with taxonomy_id=
            // join all the bits with OR
            if (store.visible_classes.length > 0) {
                this.cql_filter = `taxonomy_class_id IN (${store.visible_classes.join(',')})`;
            } else {
                this.cql_filter = '';
            }
            MapManager.refresh();
        });

        this.cql_filter = '';

        /*
        we want to create a base open layers map that will be used by the annotation tool

        we need to have a layer switcher control to select
          - base maps
          - images
          - annotations

        a way to load features/annotations from geoserver
          have an input text, user enters the location of a geoserver installatino
          from there, script loads layers visible from that geoserver's rest api
          populates the layer switcher
        the possibility to edit these features and add new ones
        a projection selector
         */

        // create a view centered around canada
        let CRIM = [-73.623173, 45.531694];
        this.view = new ol.View({
            center: ol.proj.fromLonLat(CRIM),
            zoom: 16
        });

        // create the map
        this.map = new ol.Map({
            layers: this.make_layers(),
            target: map_div_id,
            view: this.view,
        });

        // We need to set the maps of the layers after creating the map
        // because to create the map, we need the layers to be created already
        // some kind of deadlock
        // FIXME maybe that's not exactly true, maybe investigate
        Object.keys(ANNOTATION.STATUS).forEach(key => {
            const status = ANNOTATION.STATUS[key];
            store.annotations_layers[status].setMap(this.map);
        });

        // add base controls (mouse position, projection selection)
        this.mouse_position = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: 'EPSG:4326',
            undefinedHTML: '&nbsp;'
        });
        this.map.addControl(this.mouse_position);

        this.map.getViewport().addEventListener('click', this.receive_map_viewport_click_event);

        // create layer switcher, populate with base layers and feature layers
        this.layer_switcher = new ol.control.LayerSwitcher({
            target: 'layer-switcher',
            open: true
        });
        this.map.addControl(this.layer_switcher);
        this.layer_switcher.showPanel();
        this.layer_switcher.onmouseover = null;
        // select a default base map

        this.formatGeoJson = new ol.format.GeoJSON({
            dataProjection: 'EPSG:3857',
            featureProjection: 'EPSG:3857',
            geometryName: 'geometry',
        });

        mobx.autorun(() => {
            switch (store.mode) {
                case MODE.CREATION:
                    if (store.selected_taxonomy_class_id > 0) {
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

    async receive_drawend_event(event) {

        const feature = event.feature;
        feature.setProperties({
            taxonomy_class_id: store.selected_taxonomy_class_id,
            annotator_id: 1,
            image_name: 'My Image',
        });
        const payload = this.formatGeoJson.writeFeature(feature);

        try {
            const new_feature_id = await create_geojson_feature(payload);
            feature.setId(`${this.annotation_layer}.${new_feature_id}`);
        } catch (error) {
            MapManager.geojsonLogError(error);
        }

    }

    async receive_modifyend_event(event) {

        let modifiedFeatures = [];
        event.features.forEach((feature) => {
            if (feature.revision_ >= 1) {
                modifiedFeatures.push(feature);
                feature.revision_ = 0;
            }
        });
        let payload = this.formatGeoJson.writeFeatures(modifiedFeatures);

        try {
            await modify_geojson_features(payload);
        } catch (error) {
            MapManager.geojsonLogError(error);
        }

    }

    receive_map_viewport_click_event(event) {

        this.map.forEachFeatureAtPixel(this.map.getEventPixel(event), async feature => {
            if (store.mode === MODE.DELETE) {
                // TODO the feature to be deleted should be highlited at this point
                await notifier.confirm(`Do you really want to delete the highlighted feature?`);

                let payload = JSON.stringify([feature.getId()]);

                // TODO deleting annotations that are of a higher status than new should be reserved to users with higher rights

                try {
                    await delete_geojson_feature(payload);
                    // FIXME the feature is not necessarily from the new_annotations source
                    // find the right source from which to remove it
                    store.annotations_sources[ANNOTATION.STATUS.NEW].removeFeature(feature);
                } catch (error) {
                    MapManager.geojsonLogError(error);
                }
            }
        });

    }

    create_vector_source(features, status) {
        return new ol.source.Vector({
            format: new ol.format.GeoJSON(),
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
            strategy: ol.loadingstrategy.bbox
        });
    }

    static geojsonLogError(error) {
        notifier.err('The api rejected our request. There is likely more information in the console.');
        console.log('we had a problem with the geojson transaction: %o', error);
    }

    make_layers() {
        const base_maps = [];
        base_maps.push(new ol.layer.Tile({
            title: 'OSM',
            type: 'base',
            source: new ol.source.OSM(),
            zIndex: Z_INDEX.BASEMAP,
            visible: false,
        }));
        base_maps.push(new ol.layer.Tile({
            title: 'Aerial with labels',
            type: 'base',
            preload: Infinity,
            source: new ol.source.BingMaps({
                key: BING_API_KEY,
                imagerySet: 'AerialWithLabels',
            }),
            zIndex: Z_INDEX.BASEMAP,
            visible: false,
        }));
        base_maps.push(new ol.layer.Tile({
            title: 'Aerial',
            type: 'base',
            preload: Infinity,
            source: new ol.source.BingMaps({
                key: BING_API_KEY,
                imagerySet: 'Aerial',
            }),
            zIndex: Z_INDEX.BASEMAP,
        }));
        const NRG_layers = [];
        IMAGES_NRG.forEach(i => {
            NRG_layers.push(new ol.layer.Tile({
                title: i,
                source: new ol.source.TileWMS({
                    url: `${this.geoserver_url}/GeoImageNet/wms`,
                    params: {'LAYERS': `GeoImageNet:${i}`},
                    ratio: 1,
                    serverType: 'geoserver',
                }),
                visible: false,
            }));
        });
        const RGB_layers = [];
        IMAGES_RGB.forEach(i => {
            RGB_layers.push(new ol.layer.Tile({
                title: i,
                source: new ol.source.TileWMS({
                    url: `${this.geoserver_url}/GeoImageNet/wms`,
                    params: {'LAYERS': `GeoImageNet:${i}`},
                    ratio: 1,
                    serverType: 'geoserver',
                }),
                visible: false,
            }));
        });
        return [
            new ol.layer.Group({
                title: 'RGB Images',
                layers: RGB_layers
            }),
            new ol.layer.Group({
                title: 'NRG Images',
                layers: NRG_layers
            }),
            new ol.layer.Group({
                title: 'Base maps',
                layers: base_maps
            }),
            new ol.layer.Group({
                title: 'Annotations',
                layers: [store.annotations_layers[ANNOTATION.STATUS.NEW]]
            }),
        ];
    }

}
