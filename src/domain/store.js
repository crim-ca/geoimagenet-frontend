import {ANNOTATION, MODE} from './constants';
import {observable, action, runInAction, configure} from 'mobx';
import {TaxonomyClass} from './entities.js';

const default_store_schematics = {

    mode: MODE.VISUALIZE,
    actions_activated: false,

    taxonomy: [],
    selected_taxonomy: {
        id: 0,
        name: '',
        version: 0,
        elements: [],
        root_taxonomy_class_id: 0,
    },

    flat_taxonomy_classes: {},

    selected_taxonomy_class_id: -1,
    visible_classes: [],

    annotations_collections: {},
    annotations_sources: {},
    annotations_layers: {},

    current_annotation: {
        initialized: false,
        image_title: ''
    },

};
const create_store = (store_schematics = null) => {
    if (store_schematics === null) {
        return default_store_schematics;
    }
    return store_schematics;
};

export const create_state_proxy = (store_schematics = null) => {
    const store = create_store(store_schematics);
    return observable.object(store);
};

/**
 * this is relatively important in the sense that it constraints us to mutate the store only in actions
 * otherwise, changing the store, affecting the state each time, can be compared to an open heart hemorrhage
 */
configure({
    enforceActions: 'always',
});


/**
 * The store actions are lower level action handlers, in the sense that they are not directly related to a user's actions,
 * but rather are used strictly to update the state of the application, upon which the ui will depend.
 */

export class StoreActions {

    /**
     * We use MobX as our state manager, hence our store is the primary dependency of our store actions.
     * @param {Observable} state_proxy
     */
    constructor(state_proxy) {
        /**
         * @type {Observable}
         */
        this.state_proxy = state_proxy;
    }

    /**
     * We work around the return value of array.find, that is, the value associated to the first callback that returns true.
     * It would work perfectly on a flat array, but on a nested one, returning true from the inner loop
     * makes the outer loop element be returned from the find.
     * Hence, when we find the element, we assign it to result and return true to exit the loop.
     * This makes finding the element some kind of side effect of the find, instead of its primary function.
     *
     * @param {array} collection
     * @param {int} target_id
     * @returns {object}
     */
    find_element_by_id(collection, target_id) {


        const loop = (collection, target_id, result) => {
            collection.find((e) => {
                if (parseInt(e.id) === parseInt(target_id)) {
                    result.element = e;
                    return true;
                }
                if (e.children) {
                    return loop(e.children, target_id, result);
                }
                return false;
            });
        };

        let result = {};
        loop(collection, target_id, result);

        return result.element;
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

    /**
     * Invert the opened property for specific taxonomy class id
     * @param {int} taxonomy_class_id
     */
    @action.bound
    toggle_taxonomy_class_tree_element(taxonomy_class_id) {
        /** @type {TaxonomyClass} taxonomy_class */
        const taxonomy_class = this.state_proxy.flat_taxonomy_classes[taxonomy_class_id];
        taxonomy_class.opened = !taxonomy_class.opened;
    }

    @action.bound
    set_taxonomy_classes_visibility(taxonomy_class_ids) {
        taxonomy_class_ids.forEach(id => {
            let taxonomy_class = this.find_element_by_id(this.state_proxy.selected_taxonomy.elements, id);
            taxonomy_class['visible'] = !taxonomy_class['visible'];
        });
    }

    /**
     * Take the raw data structure from the api and transform it into usable structures for the UI.
     *
     * loop over an object, build a class instance from it.
     * assign the class instance to its index in the flat taxonomy list
     * if we have a parent id, add the instance to the children of said parent id in the flat list
     * iw we have children, recursive call to this function for each children
     *
     * @param {object} nested_taxonomy_classes_from_api
     */
    @action.bound
    build_taxonomy_classes_structures(nested_taxonomy_classes_from_api) {

        const assign_top_object_to_list = (object, parent_id = null) => {
            const current_raw = object;

            const current_instance = observable.object(new TaxonomyClass(
                current_raw.id,
                current_raw.name,
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

        assign_top_object_to_list(nested_taxonomy_classes_from_api);

    }

    /**
     * Call when it's certain the the annotation was added, this only updates the local storage for displaying purposes.
     * Counts not being computed automaticaly from children counts (nothing really to gain there for now)
     * we also need to update the parent's new annotations count if any.
     * @public
     * @param {Number} taxonomy_class_id
     */
    @action.bound
    increment_new_annotations_count(taxonomy_class_id) {

        let instance = this.state_proxy.flat_taxonomy_classes[taxonomy_class_id];
        let counts = instance['counts'];

        /**
         * Technically this could be initialized, but in the case it's not, put a 1 in there.
         * @type {*|number}
         */
        counts[ANNOTATION.STATUS.NEW] = (counts[ANNOTATION.STATUS.NEW] + 1) || 1;

        while (instance.parent_id !== null) {
            instance = this.state_proxy.flat_taxonomy_classes[instance.parent_id];
            counts = instance['counts'];
            counts[ANNOTATION.STATUS.NEW] = (counts[ANNOTATION.STATUS.NEW] + 1) || 1;
        }

    }

    @action.bound
    start_annotation(image_title) {
        this.state_proxy.current_annotation.initialized = true;
        this.state_proxy.current_annotation.image_title = image_title;
    }

    @action.bound
    end_annotation() {
        this.state_proxy.current_annotation.initialized = false;
        this.state_proxy.current_annotation.image_title = '';
    }

    /**
     *
     * @param {Object} counts
     */
    @action.bound
    set_annotation_counts(counts) {
        for (let class_id in counts) {
            this.state_proxy.flat_taxonomy_classes[class_id].counts = counts[class_id];
        }
    }

    @action.bound
    set_annotation_collection(key, collection) {
        this.state_proxy.annotations_collections[key] = collection;
    }

    @action.bound
    set_annotation_source(key, source) {
        this.state_proxy.annotations_sources[key] = source;
    }

    @action.bound
    set_annotation_layer(key, layer) {
        this.state_proxy.annotations_layers[key] = layer;
    }

    @action.bound
    set_taxonomy(t) {
        this.state_proxy.taxonomy = t;
    }

    @action.bound
    set_selected_taxonomy(t) {
        this.state_proxy.selected_taxonomy = t;
    }

    /**
     * Inverts a taxonomy class annotations visibility on the viewport, as well as all this class's children's visibility.
     * Note that filters still apply on what annotations statuses are shown.
     * @param {object} t
     * @param {boolean|null} visible if null, assumes that we want to invert the visible property of the class,
     *                       otherwise sets visibility to visible value passed to the function
     */
    @action.bound
    invert_taxonomy_class_visibility(t, visible = null) {
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
            if (taxonomy_class.children && taxonomy_class.children.length > 0) {
                aggregate_selected_ids(taxonomy_class.children);
            }
        };

        this.state_proxy.selected_taxonomy.elements.forEach(c => {
            aggregate_selected_ids(c);
        });
        this.set_visible_classes(visible_ids);

    }

    /**
     * Sets (overwriting if needed) the selected taxonomy classes, then sets visibility to true for everyone
     * @param {array} c
     */
    @action.bound
    set_taxonomy_class(c) {
        c.forEach(t => {
            this.invert_taxonomy_class_visibility(t, true);
        });
        this.state_proxy.selected_taxonomy.elements = c;
    }

    /**
     * @todo maybe directly watch on the visible attribute of the nested classes
     * The cql filter runs on watching an array of ids, updating visible annotations when it changes.
     * This should be called with the new array of visible ids whenever it changes.
     * Liable to human error.
     * @param {int[]} classes
     */
    @action.bound
    set_visible_classes(classes) {
        this.state_proxy.visible_classes = classes;
    }

    /**
     * When clicking on taxonomy classes leafs (and leafs only) we want to give the ability to the user of creating annotations.
     * This will cascade the ability to the ui of creating annotations.
     * @param {int} id
     */
    @action.bound
    select_taxonomy_class(id) {
        this.state_proxy.selected_taxonomy_class_id = id;
    }

    /**
     * Simply sets the current platform mode. Observed by other parts of the application.
     * @param {MODE} mode
     */
    @action.bound
    set_mode(mode) {
        if (Object.values(MODE).indexOf(mode) > -1) {
            this.state_proxy.mode = mode;
        } else {
            throw Error(`The mode ${mode} is not a valid mode within this application`);
        }
    }

}
