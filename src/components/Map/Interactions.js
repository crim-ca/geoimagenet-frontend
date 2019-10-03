// @flow strict
/**
 * We group the Open Layers map interactions here
 */

import {autorun} from "mobx";
import {ANNOTATION, CUSTOM_GEOIM_IMAGE_LAYER, MODE} from "../../domain/constants";
import {Draw, Modify, Select} from "ol/interaction";
import {NotificationManager} from "react-notifications";

import typeof Map from 'ol/Map.js';
import GeoJSON from "ol/format/GeoJSON.js";
import {GeoImageNetStore} from "../../store/GeoImageNetStore";
import {UserInteractions} from "../../domain";
import typeof Event from 'ol/events/Event.js';
import {create_style_function} from "./ol_dependant_utils";
import {MapBrowserEvent} from "ol/events";
import {ContextualMenuManager} from "../ContextualMenu/ContextualMenuManager";
import type {OpenLayersStore} from "../../store/OpenLayersStore";

const make_feature_selection_condition = (map: Map, state_proxy: GeoImageNetStore, open_layers_store: OpenLayersStore) => (event: MapBrowserEvent) => {
    if (event.type !== 'click') {
        return false;
    }
    const pixel = event.pixel;
    const features = map.getFeaturesAtPixel(pixel);
    /**
     * if we're slicking on a single feature, or clicking in empty space (that is, features is null), we want the event to be handled normally
     */
    if (features === null || features.length === 1) {
        return true;
    }
    /**
     * if we got here, technically there are multiple features under the click, so we want to ask user what feature they want to select,
     * and then add that feature to the selected features collection.
     */
    const menu_items = [];

    features.forEach(feature => {
        const taxonomy_class_id = feature.get('taxonomy_class_id');
        menu_items.push({
            text: state_proxy.flat_taxonomy_classes[taxonomy_class_id].name_en,
            value: feature,
        });
    });

    ContextualMenuManager.choose_option(menu_items).then(
        choice => {
            open_layers_store.select_feature(choice);
        },
        error => {
            console.log(error);
            open_layers_store.clear_selected_features();
            NotificationManager.info("That wasn't a valid feature choice, we unselected everything.");
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
    state_proxy: GeoImageNetStore;
    user_interactions: UserInteractions;
    open_layers_store: OpenLayersStore;
    geojson_format: GeoJSON;
    annotation_layer: string;
    draw: Draw;
    modify: Modify;
    select: Select;

    constructor(
        map: Map,
        state_proxy: GeoImageNetStore,
        user_interactions: UserInteractions,
        open_layers_store: OpenLayersStore,
        geojson_format: GeoJSON,
        annotation_layer: string,
    ) {
        this.map = map;
        this.state_proxy = state_proxy;
        this.user_interactions = user_interactions;
        this.open_layers_store = open_layers_store;
        this.geojson_format = geojson_format;
        this.annotation_layer = annotation_layer;

        const layers = Object.keys(this.state_proxy.annotations_layers).map(key => {
            return this.state_proxy.annotations_layers[key];
        });
        /**
         * We can select layers from any and all layers, so we activate it on all layers by default.
         */
        this.select = new Select({
            condition: make_feature_selection_condition(map, this.state_proxy, this.open_layers_store),
            layers: layers,
            style: create_style_function('white', this.state_proxy, true),
            features: this.open_layers_store.selected_features,
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

        this.draw.on('drawend', this.user_interactions.create_drawend_handler(this.geojson_format, this.annotation_layer));
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
