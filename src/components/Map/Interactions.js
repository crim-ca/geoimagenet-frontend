// @flow strict
/**
 * We group the Open Layers map interactions here
 */

import {autorun} from "mobx";
import {ANNOTATION, CUSTOM_GEOIM_IMAGE_LAYER, MODE} from "../../domain/constants";
import {Draw, Modify, Select} from "ol/interaction";
import {NotificationManager} from "react-notifications";

import Map from 'ol/Map.js';
import GeoJSON from "ol/format/GeoJSON.js";
import {GeoImageNetStore} from "../../store/GeoImageNetStore";
import {UserInteractions} from "../../domain";
import typeof Event from 'ol/events/Event.js';
import {create_style_function} from "./utils";

export class Interactions {

    map: Map;
    state_proxy: GeoImageNetStore;
    user_interactions: UserInteractions;
    geojson_format: GeoJSON;
    annotation_layer: string;
    annotation_namespace: string;
    draw: Draw;
    modify: Modify;
    select: Select;

    constructor(
        map: Map,
        state_proxy:GeoImageNetStore,
        user_interactions: UserInteractions,
        geojson_format: GeoJSON,
        annotation_layer: string,
        annotation_namespace: string,
    ) {
        this.map = map;
        this.state_proxy = state_proxy;
        this.user_interactions = user_interactions;
        this.geojson_format = geojson_format;
        this.annotation_layer = annotation_layer;
        this.annotation_namespace = annotation_namespace;

        const layers = Object.keys(this.state_proxy.annotations_layers).map(key => {
            return this.state_proxy.annotations_layers[key];
        });
        /**
         * We can select layers from any and all layers, so we activate it on all layers by default.
         */
        this.select = new Select({
            layers: layers,
            style: create_style_function('white', this.state_proxy, true),
        });
        this.map.addInteraction(this.select);

        /**
         * Map interaction to modify existing annotations. To be disabled when zoomed out too far.
         */
        this.modify = new Modify({
            features: this.state_proxy.annotations_collections[ANNOTATION.STATUS.NEW],
        });
        /**
         * Map interaction to create new annotations. To be disabled when zoomed out too far.
         */
        this.draw = new Draw({
            source: this.state_proxy.annotations_sources[ANNOTATION.STATUS.NEW],
            type: 'Polygon',
            condition: this.draw_condition_callback
        });

        this.draw.on('drawend', this.user_interactions.create_drawend_handler(this.geojson_format, this.annotation_layer, this.annotation_namespace));
        this.modify.on('modifystart', this.user_interactions.modifystart_handler);
        this.modify.on('modifyend', this.user_interactions.create_modifyend_handler(this.geojson_format, this.map));

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
     * When in annotation mode, we need some kind of control over the effect of each click.
     * This callback should check domain conditions for the click to be valid and return a boolean to that effect.
     * Domain prevalidation of annotations should happen here.
     */
    draw_condition_callback = (event: Event): boolean => {

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

        this.user_interactions.start_annotation(first_layer.get('title'));

        return true;
    };

}
