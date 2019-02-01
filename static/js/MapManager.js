import {
    MODE,
    ANNOTATION,
    IMAGES_NRG,
    IMAGES_RGB, BING_API_KEY,
    Z_INDEX,
} from './constants.js';
import {store} from './store.js';
import {notifier} from './utils/notifications.js'
import {make_http_request} from './utils/http.js';

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

    refresh() {
        this.new_annotations_source.clear();
        this.new_annotations_source.refresh(true);
        this.released_annotations_source.clear();
        this.released_annotations_source.refresh(true);
    }

    constructor(geoserver_url, geoimagenet_api_url, annotation_namespace_uri, annotation_namespace, annotation_layer, map_div_id) {

        this.geoserver_url = geoserver_url;
        this.geoimagenet_api_url = geoimagenet_api_url;
        this.annotation_namespace = annotation_namespace;
        this.annotation_layer = annotation_layer;

        const style = getComputedStyle(document.body);
        const color_new = style.getPropertyValue('--color-new');
        this.new_annotations_collection = new ol.Collection();
        this.released_annotations_collection = new ol.Collection();
        this.new_annotations_source = this.create_vector_source(this.new_annotations_collection, ANNOTATION.STATUS.NEW);
        this.new_annotations_layer = create_vector_layer(ANNOTATION.STATUS.NEW, this.new_annotations_source, color_new);

        this.released_annotations_source = this.create_vector_source(this.released_annotations_collection, ANNOTATION.STATUS.RELEASED);

        this.modify = new ol.interaction.Modify({
            features: this.new_annotations_collection,
        });
        this.modify.on('modifyend', (e) => {
            let modifiedFeatures = [];
            e.features.forEach((feature) => {
                if (feature.revision_ >= 1) {
                    modifiedFeatures.push(feature);
                    feature.revision_ = 0;
                }
            });
            this.geoJsonPut(modifiedFeatures);
        });
        this.new_annotations_collection.on('add', (e) => {
            e.element.revision_ = 0;
        });
        this.draw = new ol.interaction.Draw({
            source: this.new_annotations_source,
            type: 'Polygon',
        });
        this.draw.on('drawend', (e) => {
            const feature = e.feature;
            this.new_annotations_source.refresh();
            this.geoJsonPost(feature);
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
            this.refresh();
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

        // add base controls (mouse position, projection selection)
        this.mouse_position = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: 'EPSG:4326',
            undefinedHTML: '&nbsp;'
        });
        this.map.addControl(this.mouse_position);

        this.map.getViewport().addEventListener('click', event => {
            this.map.forEachFeatureAtPixel(this.map.getEventPixel(event), feature => {
                if (store.mode === MODE.DELETE) {
                    notifier.confirm(`Do you really want to delete the highlighted feature?`)
                        .then(() => {
                            this.geoJsonDelete(feature);
                        })
                        .catch((err) => {
                            console.log('rejected: %o', err);
                        });
                }
            });
        });

        // create layer switcher, populate with base layers and feature layers
        this.layer_switcher = new ol.control.LayerSwitcher({
            target: 'layer-switcher',
            open: true
        });
        this.map.addControl(this.layer_switcher);
        this.layer_switcher.showPanel();
        this.layer_switcher.onmouseover = null;
        // select a default base map

        this.features = new ol.Collection();

        const color_released = style.getPropertyValue('--color-released');

        this.new_annotations_layer.setMap(this.map);

        this.released_annotations_layer = create_vector_layer(ANNOTATION.STATUS.RELEASED, this.released_annotations_source, color_released);
        this.released_annotations_layer.setMap(this.map);

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

    geoJsonPost(feature) {
        feature.setProperties({
            taxonomy_class_id: store.selected_taxonomy_class_id,
            annotator_id: 1,
            image_name: 'My Image',
        });
        let payload = this.formatGeoJson.writeFeature(feature);
        make_http_request(`${this.geoimagenet_api_url}/annotations`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: payload,
        }).then((response) => {
            return response.json();
        }).then((responseJson) => {
            feature.setId(`${this.annotation_layer}.${responseJson}`);
        }).catch(error => {
            MapManager.geojsonLogError(error);
        });
    }

    geoJsonPut(features) {
        let payload = this.formatGeoJson.writeFeatures(features);
        make_http_request(`${this.geoimagenet_api_url}/annotations`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: payload,
        }).then(() => {
            // FIXME refreshing everything is probably not efficient
            this.refresh();
        }).catch(error => {
            MapManager.geojsonLogError(error);
        });
    }

    geoJsonDelete(feature) {
        let payload = JSON.stringify([feature.getId()]);
        // TODO verify if deleting annotations can only happen on new, unreleased annotations
        // otherwise, this is a bit more complicated, as the feature could be on any of the layers (and vector sources)
        make_http_request(`${this.geoimagenet_api_url}/annotations`, {
            method: "DELETE",
            headers: {'Content-Type': 'application/json'},
            body: payload,
        }).then((response) => {
            this.new_annotations_source.removeFeature(feature);
        }).catch(error => {
            MapManager.geojsonLogError(error);
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
            zIndex:Z_INDEX.BASEMAP,
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
            zIndex:Z_INDEX.BASEMAP,
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
            zIndex:Z_INDEX.BASEMAP,
        }));
        const NRG_layers = [];
        IMAGES_NRG.forEach(i => {
            NRG_layers.push(new ol.layer.Tile({
                title: i,
                source: new ol.source.TileWMS({
                    url: `${this.geoserver_url}/geoserver/GeoImageNet/wms`,
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
                    url: `${this.geoserver_url}/geoserver/GeoImageNet/wms`,
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
                layers: [this.new_annotations_layer]
            }),
        ];
    }

}
