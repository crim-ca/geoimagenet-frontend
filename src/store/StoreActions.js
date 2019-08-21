// @flow strict

import {TaxonomyClass} from '../domain/entities.js';
import {ANNOTATION, MODE} from '../domain/constants.js';
import {observable, action, runInAction} from 'mobx';
import {AccessControlList} from "../domain/access-control-list";
import {Taxonomy, User} from "../domain/entities";
import {typeof Collection} from "ol";
import {typeof Source} from "ol/source";
import {typeof Vector} from "ol/layer";
import {GeoImageNetStore} from "./GeoImageNetStore";
import type {TaxonomyClassFromAPI} from "../Types";

/**
 * The store actions are lower level action handlers, in the sense that they are not directly related to a user's actions,
 * but rather are used strictly to update the state of the application, upon which the ui will depend.
 */

type AnnotationCounts = {
    NEW: number,
    PRE_RELEASED: number,
    RELEASED: number,
    REVIEW: number,
    VALIDATED: number,
    REJECTED: number,
    DELETED: number,
};

export class StoreActions {

    state_proxy: GeoImageNetStore;

    /**
     * We use MobX as our state manager, hence our store is the primary dependency of our store actions.
     */
    constructor(state_proxy: GeoImageNetStore) {
        this.state_proxy = state_proxy;
    }

    @action.bound
    toggle_show_labels() {
        this.state_proxy.show_labels = !this.state_proxy.show_labels;
    }

    /**
     * When user adds an annotation status to the visibility pool, we need to update the store.
     */
    @action.bound
    toggle_annotation_status_visibility(annotation_status_text: string, override_activated: boolean|null = null) {
        const annotation_status_instance = this.state_proxy.annotation_status_list[annotation_status_text];
        if (override_activated !== null) {
            annotation_status_instance.activated = override_activated;
        } else {
            annotation_status_instance.activated = !annotation_status_instance.activated;
        }
        this.set_annotation_layer_visibility(annotation_status_text, annotation_status_instance.activated);
    }

    /**
     * The annotation actions can only be done under a specific zoom level. This should be called when we are passed that threshold.
     */
    @action.bound
    activate_actions() {
        this.state_proxy.actions_activated = true;
    }

    /**
     * This should be called when we change resolution in a way that prohibits relevant annotations to be created.
     */
    @action.bound
    deactivate_actions() {
        this.state_proxy.actions_activated = false;
    }

    @action.bound
    set_session_user(user: User) {
        this.state_proxy.logged_user = user;
    }

    /**
     * Invert the opened property for specific taxonomy class id
     * @param {boolean|null} opened we should allow to override the toggling to force open or closed
     */
    @action.bound
    toggle_taxonomy_class_tree_element(taxonomy_class_id: number, opened: boolean | null = null) {
        /** @type {TaxonomyClass} taxonomy_class */
        const taxonomy_class = this.state_proxy.flat_taxonomy_classes[taxonomy_class_id];
        if (opened === null) {
            taxonomy_class.opened = !taxonomy_class.opened;
            return;
        }
        taxonomy_class.opened = opened;
    }

    /**
     * We want to extract all localized taxonomy classes strings and send them in a dictionary that makes ids correspond to names.
     * Later on, we'll use i18next to translate the strings.
     */
    @action.bound
    generate_localized_taxonomy_classes_labels(lang: string) {
        const {flat_taxonomy_classes} = this.state_proxy;
        const dict = {};
        for (const taxonomy_class_id in flat_taxonomy_classes) {
            if (flat_taxonomy_classes.hasOwnProperty(taxonomy_class_id)) {
                const taxonomy_class = flat_taxonomy_classes[taxonomy_class_id];
                const name_tag = `name_${lang}`;
                if (taxonomy_class.hasOwnProperty(name_tag)) {
                    dict[taxonomy_class.id] = taxonomy_class[name_tag];
                }
            }

        }
        return dict;
    }

    /**
     * Take the raw data structure from the api and transform it into usable structures for the UI.
     *
     * loop over an object, build a class instance from it.
     * assign the class instance to its index in the flat taxonomy list
     * if we have a parent id, add the instance to the children of said parent id in the flat list
     * iw we have children, recursive call to this function for each children
     *
     */
    @action.bound
    build_taxonomy_classes_structures(taxonomy_class_from_api: TaxonomyClassFromAPI) {

        const assign_top_object_to_list = (object, parent_id = null) => {
            const current_raw = object;

            /**
             * Not quite completely sure why and how the observable.object is needed here.
             * I think it's because mobx does not observe too deeply nested object's properties.
             * @type {TaxonomyClass & IObservableObject}
             */
            const current_instance = observable.object(new TaxonomyClass(
                current_raw.id,
                current_raw.name_fr,
                current_raw.name_en,
                current_raw.taxonomy_id
            ));
            this.state_proxy.flat_taxonomy_classes[current_instance.id] = current_instance;

            if (parent_id !== null) {
                current_instance.parent_id = parent_id;
                this.state_proxy.flat_taxonomy_classes[parent_id].children.push(current_instance);
            }

            if (current_raw.children && current_raw.children.length > 0) {
                current_raw.children.forEach(c => {
                    assign_top_object_to_list(c, current_raw.id);
                });
            }
        };

        assign_top_object_to_list(taxonomy_class_from_api);

    }

    /**
     * When changing an annotation count, we need to go up the annotation tree and accomplish the same change.
     * Parent classes count all their children, so a change on a children must affect all parents.
     */
    @action.bound
    change_annotation_status_count(taxonomy_class_id: number, status: string, quantity: number) {

        if (!Number.isInteger(quantity) || quantity === 0) {
            throw new TypeError(`${quantity} is an invalid quantity argument to change annotation counts.`);
        }
        if (Object.values(ANNOTATION.STATUS).indexOf(status) === -1) {
            throw new TypeError(`${status} is not a status that is supported by our platform.`);
        }
        if (! (taxonomy_class_id in this.state_proxy.flat_taxonomy_classes)) {
            throw new TypeError('Trying to change the counts of a non-existent taxonomy class.');
        }

        let instance = this.state_proxy.flat_taxonomy_classes[taxonomy_class_id];
        let {counts} = instance;
        /**
         * if we're under 0, we're decrementing, and the lowest possible value is 0.
         * otherwise, we might be adding to an undefined number, so default to 1 in that case
         *
         * since the quantity is under 0, we need to _add_ it to the count so that it is correctly substracted to the value
         */
        counts[status] = quantity < 0 ? Math.max(counts[status] + quantity, 0) : (counts[status] + quantity) || quantity;

        while (instance.parent_id !== null) {
            instance = this.state_proxy.flat_taxonomy_classes[instance.parent_id];
            ({counts} = instance);
            counts[status] = quantity < 0 ? Math.max(counts[status] + quantity, 0) : (counts[status] + quantity) || quantity;
        }
    }

    @action.bound
    start_annotation(image_title: string) {
        this.state_proxy.current_annotation.initialized = true;
        this.state_proxy.current_annotation.image_title = image_title;
    }

    @action.bound
    end_annotation() {
        this.state_proxy.current_annotation.initialized = false;
        this.state_proxy.current_annotation.image_title = '';
    }

    @action.bound
    set_annotation_counts(counts: AnnotationCounts) {
        for (let class_id in counts) {
            this.state_proxy.flat_taxonomy_classes[class_id].counts = counts[class_id];
        }
    }

    @action.bound
    set_annotation_collection(key: string, collection: Collection) {
        this.state_proxy.annotations_collections[key] = collection;
    }

    @action.bound
    set_annotation_source(key: string, source: Source) {
        this.state_proxy.annotations_sources[key] = source;
    }

    @action.bound
    set_annotation_layer(key: string, layer: Vector) {
        this.state_proxy.annotations_layers[key] = layer;
    }

    /**
     * we have the annotation layers stored. When changing the visibility of a layer somehow, we should call this to set
     * the appropriate visibility on the layer.
     */
    @action.bound
    set_annotation_layer_visibility(key: string, visible: boolean) {
        this.state_proxy.annotation_status_list[key].activated = visible;
    }

    @action.bound
    set_taxonomy(t: Array<Taxonomy>) {
        this.state_proxy.taxonomies = t;
        this.state_proxy.selected_taxonomy = t[0];
    }

    @action.bound
    set_selected_taxonomy(t: Taxonomy) {
        this.state_proxy.selected_taxonomy = t;
    }

    /**
     * Inverts a taxonomy class annotations visibility on the viewport, as well as all this class's children's visibility.
     * Note that filters still apply on what annotations statuses are shown.
     * @param {boolean|null} visible if null, assumes that we want to invert the visible property of the class,
     *                       otherwise sets visibility to visible value passed to the function
     */
    @action.bound
    invert_taxonomy_class_visibility(t: TaxonomyClass, visible: boolean | null = null) {
        runInAction(() => {
            if (visible !== null) {
                t.visible = visible;
            } else {
                t.visible = !t.visible;
            }
            if (t.children && t.children.length > 0) {
                t.children.forEach(c => {
                    this.invert_taxonomy_class_visibility(c, t.visible);
                });
            }
        });


        const visible_ids = [];
        const aggregate_selected_ids = (taxonomy_class) => {
            if (taxonomy_class.visible === true) {
                visible_ids.push(taxonomy_class.id);
            }
        };

        Object.keys(this.state_proxy.flat_taxonomy_classes).forEach(key => {
            const taxonomy_class = this.state_proxy.flat_taxonomy_classes[key];
            aggregate_selected_ids(taxonomy_class);
        });
        this.set_visible_classes(visible_ids);

    }

    @action.bound
    set_acl(acl: AccessControlList) {
        this.state_proxy.acl = acl;
    }

    /**
     * @todo maybe directly watch on the visible attribute of the nested classes
     * The cql filter runs on watching an array of ids, updating visible annotations when it changes.
     * This should be called with the new array of visible ids whenever it changes.
     * Liable to human error.
     */
    @action.bound
    set_visible_classes(classes: Array<number>) {
        this.state_proxy.visible_classes = classes;
    }

    /**
     * When clicking on taxonomy classes leafs (and leafs only) we want to give the ability to the user of creating annotations.
     * This will cascade the ability to the ui of creating annotations.
     */
    @action.bound
    select_taxonomy_class(id: number) {
        this.state_proxy.selected_taxonomy_class_id = id;
    }

    /**
     * Simply sets the current platform mode. Observed by other parts of the application.
     */
    @action.bound
    set_mode(mode: string) {
        if (Object.values(MODE).indexOf(mode) > -1) {
            this.state_proxy.mode = mode;
        } else {
            throw Error(`The mode ${mode} is not a valid mode within this application`);
        }
    }

}
