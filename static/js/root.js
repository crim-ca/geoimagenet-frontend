const MODE = {
    INSERT: 'INSERT',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
};

class MapManager {

    /*
    using arrow functions to bind the scope of member methods
    changing foo = () => {}; to foo = function() {} _will_ break things in interesting and unexpected ways
     */

    refresh() {
        this.vectorSource.clear();
        this.vectorSource.refresh(true);
    }

    constructor(protocol, geoserver_url, annotation_namespace, annotation_layer, map_div_id, type_select_id) {

        this.geoserver_url = protocol + geoserver_url;
        this.annotation_namespace = annotation_namespace;
        this.annotation_layer = annotation_layer;
        this.type_select_id = type_select_id;

        addEventListener('selection_changed', (event) => {
            // create the cql filter from detail elements
            // prepend each bit with taxonomy_id=
            // join all the bits with OR
            const activated_taxonomies = event.detail;
            const filter_bits = [];
            activated_taxonomies.forEach(class_name => {
                filter_bits.push(`taxonomy_id='${class_name}'`);
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
        this.featureOverlay = new ol.layer.Vector({
            source: this.vectorSource,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });
        this.featureOverlay.setMap(this.map);

        this.formatWFS = new ol.format.WFS();
        this.formatGML = new ol.format.GML({
            featureNS: this.annotation_namespace,
            featureType: this.annotation_layer,
            srsName: 'EPSG:3857'
        });
        this.XML_serializer = new XMLSerializer();

        this.register_geoserver_url_button();
    }

    activate_interactions() {
        this.modify = new ol.interaction.Modify({
            source: this.vectorSource,
        });
        this.map.addInteraction(this.modify);
        this.modify.on('modifyend', (e) => {
            console.groupCollapsed('Modify event has fired.');
            console.log('modifyend event: %o', e);
            const features = e.features.getArray();
            const feature = e.features.getArray()[0];
            const id = feature.getId();
            console.log('feature: %o, id: %o', feature, id);
            this.WFS_transaction(MODE.UPDATE, features);
            console.groupEnd();
        });

        this.typeSelect = document.getElementById(this.type_select_id);

        this.typeSelect.onchange = () => {
            this.map.removeInteraction(this.draw);
            this.addInteraction();
        };

        this.addInteraction();
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

    WFS_transaction(mode, feature) {
        console.groupCollapsed('WFS Transaction');
        let node;
        switch (mode) {
            case MODE.INSERT:
                console.log('firing write transaction');
                const selected_taxonomy_element = document.querySelector('input[name=selected_taxonomy]:checked');
                if (!selected_taxonomy_element) {
                    throw 'You must select a taxonomy before adding annotations';
                }
                const selected_taxonomy = selected_taxonomy_element.value;
                feature.setProperties({taxonomy_id: selected_taxonomy});
                node = this.formatWFS.writeTransaction([feature], null, null, this.formatGML);
                break;
            case MODE.UPDATE:
                console.log('firing update transaction');
                feature.forEach(f => {
                    console.log(f.getProperties());
                });
                node = this.formatWFS.writeTransaction(null, feature, null, this.formatGML);
                break;
            case MODE.DELETE:
                console.log('firing delete transaction');
                node = this.formatWFS.writeTransaction(null, null, [feature], this.formatGML);
                break;
            default:
                throw 'The transaction mode should be defined when calling WFS_transaction.';
        }
        const payload = this.XML_serializer.serializeToString(node);
        // const url = 'http://10.30.90.94:8080/geoserver/GeoImageNet/wfs';
        const url = `${this.geoserver_url}/geoserver/GeoImageNet/wfs`;
        fetch(url, {
            service: 'WFS',
            method: 'POST',
            body: payload,
        }).then(() => {
            this.refresh();
        });
        console.groupEnd();
    }

    addInteraction() {

        this.draw = new ol.interaction.Draw({
            features: this.features,
            type: (this.typeSelect.value)
        });

        this.draw.on('drawend', (e) => {
            console.groupCollapsed('Draw events');

            const feature = e.feature;
            console.log('got feature: %o', feature);

            this.WFS_transaction(MODE.INSERT, feature);

            console.groupEnd();
        });

        this.map.addInteraction(this.draw);
    }

    make_layers() {
        const raster = new ol.layer.Tile({
            title: 'OSM',
            type: 'base',
            source: new ol.source.OSM(),
        });

        // TODO taxonomy_id is a variable as well
        this.vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: () => {
                let url = `${this.geoserver_url}/geoserver/wfs?service=WFS&` +
                    `version=1.1.0&request=GetFeature&typename=${this.annotation_namespace}:${this.annotation_layer}&` +
                    'outputFormat=application/json&srsname=EPSG:3857';
                if (this.cql_filter.length > 0) {
                    url += `&cql_filter=${this.cql_filter}`;
                }
                return url;
            },
            strategy: ol.loadingstrategy.bbox
        });


        var vector = new ol.layer.Vector({
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

class TaxonomyBrowser {

    constructor(taxonomy, mapManager) {

        this.mapManager = mapManager;
        this.classes_element = document.getElementById('taxonomy_classes');
        this.selection = [];
        this.annotation_is_activated = false;

        this.store = mobx.observable({
            taxonomy: [],
            taxonomy_class: []
        });

        this.fire_selection_changed = (event) => {
            // receive the checkbox selection event and manage activation state
            // if the checkbox is checked, add it to the selection
            // if it's not, remove it
            console.log('checkbox has been checked. event: %o, checked: %o', event, event.target.checked);
            if (event.target.checked) {
                this.selection.push(event.target.value);
            } else {
                delete this.selection[this.selection.indexOf(event.target.value)];
            }
            event = new CustomEvent('selection_changed', {detail: this.selection});
            dispatchEvent(event);
        };

        this.activate_annotation = () => {
            if (!this.annotation_is_activated) {
                this.mapManager.activate_interactions();
                this.annotation_is_activated = true;
            }
        };

        fetch(`/taxonomy`)
            .then(res => res.json())
            .then(json => {
                this.store.taxonomy = json;
            })
            .catch(err => console.log(err));

        mobx.autorun(() => {
            this.construct_children(this.classes_element, this.store.taxonomy_class);
        });

        fetch(`/taxonomy/Objets`)
                .then(res => res.json())
                .then(json => {
                    this.store.taxonomy_class = json;
                })
                .catch(err => console.log(err));
    }

    construct_children(element, collection) {
        collection.forEach(taxonomy_class => {
            const li = document.createElement('li');

            if (taxonomy_class['children'] && taxonomy_class['children'].length === 0) {
                // only leafs classes can be annotated, so only create the inputs if there are no children (leaf)
                const checkbox_selector = document.createElement('input');
                checkbox_selector.type = 'checkbox';
                checkbox_selector.value = taxonomy_class.id;
                checkbox_selector.addEventListener('change', this.fire_selection_changed);

                const radio_selector = document.createElement('input');
                radio_selector.type = 'radio';
                radio_selector.value = taxonomy_class.id;
                radio_selector.name = 'selected_taxonomy';
                radio_selector.addEventListener('change', this.activate_annotation);

                li.appendChild(checkbox_selector);
                li.appendChild(radio_selector);
            }

            const text = document.createElement('span');
            text.appendChild(document.createTextNode(taxonomy_class.name));

            li.appendChild(text);

            if (taxonomy_class['children'] && taxonomy_class['children'].length > 0) {
                li.classList.add('collapsed');
                // inside the if block because we don't need the toggle if there are no children
                text.addEventListener('click', event => {
                    event.target.parentNode.classList.toggle('collapsed');
                });

                const ul = document.createElement('ul');
                this.construct_children(ul, taxonomy_class['children']);
                li.appendChild(ul);
            }

            element.appendChild(li);
        });
    }

}
