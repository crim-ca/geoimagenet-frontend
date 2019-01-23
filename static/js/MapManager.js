import {MODE} from '/js/constants.js';
import {store} from '/js/store.js';
import {notifier} from '/js/utils/notifications.js'
import {make_http_request} from '/js/utils/http.js';

export class MapManager {

    /*
    using arrow functions to bind the scope of member methods
    changing foo = () => {}; to foo = function() {} _will_ break things in interesting and unexpected ways
     */

    refresh() {
        this.vectorSource.clear();
        this.vectorSource.refresh(true);
    }

    constructor(protocol, geoserver_url, geoimagenet_api_url, annotation_namespace_uri, annotation_namespace, annotation_layer, map_div_id) {

        this.geoserver_url = protocol + geoserver_url;
        this.geoimagenet_api_url = protocol + geoimagenet_api_url;
        this.annotation_namespace_uri = annotation_namespace_uri;
        this.annotation_namespace = annotation_namespace;
        this.annotation_layer = annotation_layer;

        this.vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: (extent) => {
                if (this.cql_filter.length > 0) {
                    return `${this.geoserver_url}/geoserver/wfs?service=WFS&` +
                        `version=1.1.0&request=GetFeature&typeName=${this.annotation_namespace}:${this.annotation_layer}&` +
                        'outputFormat=application/json&srsname=EPSG:3857&' + `cql_filter=${this.cql_filter}`;
                }
                return `${this.geoserver_url}/geoserver/wfs?service=WFS&` +
                    `version=1.1.0&request=GetFeature&typeName=${this.annotation_namespace}:${this.annotation_layer}&` +
                    'outputFormat=application/json&srsname=EPSG:3857&' +
                    'bbox=' + extent.join(',') + ',EPSG:3857';
            },
            strategy: ol.loadingstrategy.bbox
        });

        this.modify = new ol.interaction.Modify({
            source: this.vectorSource,
        });
        this.modify.on('modifyend', (e) => {
            const feature = e.features.getArray()[0];
            this.geoJsonRequest(MODE.MODIFY, feature);
        });
        this.draw = new ol.interaction.Draw({
            source: this.vectorSource,
            type: 'Polygon',
        });
        this.draw.on('drawend', (e) => {
            const feature = e.feature;
            this.vectorSource.refresh();
            this.geoJsonRequest(MODE.CREATION, feature);
        });

        addEventListener('selection_changed', (event) => {
            // create the cql filter from detail elements
            // prepend each bit with taxonomy_id=
            // join all the bits with OR
            const activated_taxonomies = event.detail;
            const filter_bits = [];
            activated_taxonomies.forEach(class_name => {
                filter_bits.push(`taxonomy_class_id='${class_name}'`);
            });
            this.cql_filter = filter_bits.join(' OR ');
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
        this.view = new ol.View({
            center: ol.proj.fromLonLat([-122.37, 49.03]),
            zoom: 13
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
                            this.geoJsonRequest(MODE.DELETE, feature);
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

        const style = getComputedStyle(document.body);
        const new_annotation_color = style.getPropertyValue('--color-new');

        this.new_annotations_overlay = new ol.layer.Vector({
            source: this.vectorSource,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.25)',
                }),
                stroke: new ol.style.Stroke({
                    color: new_annotation_color,
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: new_annotation_color,
                    })
                })
            })
        });
        this.new_annotations_overlay.setMap(this.map);

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

        this.register_geoserver_url_button();
    }

    load_layers_from_geoserver() {
        fetch(`${this.geoserver_url}/rest/layers`)
            .then(res => {
                console.log('received layers from geoserver: %o', res);
            });
    }

    register_geoserver_url_button() {
        const button = document.getElementById('populate-layer-switcher-button');
        if (button) {
            button.addEventListener('click', () => {
                const input = document.getElementById('geoserver-url');
                this.geoserver_url = input.value;
                this.load_layers_from_geoserver();
            });
        }
    }

    geoJsonRequest(mode, feature) {
        let payload;
        let method;
        switch (mode) {
            case MODE.CREATION:
                method = "POST";
                feature.setProperties({
                    taxonomy_class_id: store.selected_taxonomy_class_id,
                    annotator_id: 1,
                    image_name: 'My Image',
                });
                payload = this.formatGeoJson.writeFeature(feature);
                break;
            case MODE.MODIFY:
                method = "PUT";
                payload = this.formatGeoJson.writeFeature(feature);
                break;
            case MODE.DELETE:
                method = "DELETE";
                payload = JSON.stringify([feature['id_']]);
                break;
            default:
                throw 'The transaction mode should be defined when calling geoJsonRequest.';
        }
        make_http_request(`${this.geoimagenet_api_url}/annotations`, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: payload,
        })
            .then(response => response.json())
            .then((responseJson) => {
                feature.setProperties({'annotation_id': responseJson[0]});
            })
            .catch(error => {
                notifier.err('The api rejected our request. There is likely more information in the console.');
                console.log('we had a problem with the geojson transaction: %o', error);
            });

    }

    make_layers() {
        const raster = new ol.layer.Tile({
            title: 'OSM',
            type: 'base',
            source: new ol.source.OSM(),
        });
        const vector = new ol.layer.Vector({
            source: this.vectorSource,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 255, 1.0)',
                    width: 2
                })
            })
        });
        const some_image = new ol.layer.Image({
            title: 'image',
            source: new ol.source.ImageWMS({
                url: `${this.geoserver_url}/geoserver/GEOIMAGENET_PUBLIC/wms`,
                params: {'LAYERS': 'GEOIMAGENET_PUBLIC:OrthoImage_Vancouver_50cm_RGBN_W84U10_8bits_RGB'},
                ratio: 1,
                serverType: 'geoserver',
            }),
        });
        return [
            new ol.layer.Group({
                title: 'Base maps',
                layers: [raster, some_image]
            }),
            new ol.layer.Group({
                title: 'Annotations',
                layers: [vector]
            })
        ];
    }

}
