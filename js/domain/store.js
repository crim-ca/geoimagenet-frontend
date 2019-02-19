import {ANNOTATION, MODE} from './constants';
import {observable, action} from 'mobx';

const default_store_schematics = {

    mode: MODE.VISUALIZE,
    actions_activated: false,

    taxonomy: [],
    annotation_counts: {},
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

export class StoreActions {

    constructor(state_proxy) {
        this.state_proxy = state_proxy;
    }

    find_element_by_id(collection, target_id) {

        // Here, we work around the fact that array.find returns the first result of the array
        // It would work perfectly on a flat array, but here, if the result is nested, returning true from the inner loop,
        // makes the outer loop element be returned from the find
        // hence, when we find the element, we assign it to result and return true to exit the loop
        // this makes finding the element some kind of side effect of the find, instead of its primary function
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
    };

    @action
    activate_actions() {
        this.state_proxy.actions_activated = true;
    }

    @action
    deactivate_actions() {
        this.state_proxy.actions_activated = false;
    }

    @action
    toggle_taxonomy_class_tree_element(taxonomy_class_id) {
        let taxonomy_class = this.find_element_by_id(this.state_proxy.selected_taxonomy.elements, taxonomy_class_id);
        taxonomy_class['opened'] = !taxonomy_class['opened'];
    }

    @action
    set_taxonomy_classes_visibility(taxonomy_class_ids) {
        taxonomy_class_ids.forEach(id => {
            let taxonomy_class = this.find_element_by_id(this.state_proxy.selected_taxonomy.elements, id);
            taxonomy_class['visible'] = !taxonomy_class['visible'];
        });
    }

    @action
    increment_new_annotations_count(taxonomy_class_id) {
        this.state_proxy.annotation_counts[taxonomy_class_id][ANNOTATION.STATUS.NEW]++;
    }

    @action
    start_annotation(image_title) {
        this.state_proxy.current_annotation.initialized = true;
        this.state_proxy.current_annotation.image_title = image_title;
    }

    @action
    end_annotation() {
        this.state_proxy.current_annotation.initialized = false;
        this.state_proxy.current_annotation.image_title = '';
    }

    @action
    set_annotation_counts(counts) {
        this.state_proxy.annotation_counts = Object.assign({}, this.state_proxy.annotation_counts, counts);
    }

    @action
    set_annotation_collection(key, collection) {
        this.state_proxy.annotations_collections[key] = collection;
    }

    @action
    set_annotation_source(key, source) {
        this.state_proxy.annotations_sources[key] = source;
    }

    @action
    set_annotation_layer(key, layer) {
        this.state_proxy.annotations_layers[key] = layer;
    }

    @action
    set_taxonomy(t) {
        this.state_proxy.taxonomy = t;
    }

    @action
    set_selected_taxonomy(t) {
        this.state_proxy.selected_taxonomy = t;
    }

    @action
    set_taxonomy_class(c) {
        this.state_proxy.selected_taxonomy.elements = c;

        const flat_ancestors_and_descendants_dict = {};
        const flatten_ancestors_and_descendants = (taxonomy_class) => {
            if (taxonomy_class.children && taxonomy_class.children.length > 0) {
                const id = taxonomy_class.id;
                taxonomy_class.children.forEach((e) => {
                    if (flat_ancestors_and_descendants_dict[id]) {
                        flat_ancestors_and_descendants_dict[id].push(e);
                    } else {
                        flat_ancestors_and_descendants_dict[id] = [e];
                    }
                    if (e.children && e.children.length > 0) {
                        flatten_ancestors_and_descendants(e);
                    }
                });
            }
        };
        this.state_proxy.selected_taxonomy.elements.forEach((e) => {
            flatten_ancestors_and_descendants(e);
        });
        this.state_proxy.flat_taxonomy_classes = flat_ancestors_and_descendants_dict;
    }

    @action
    set_visible_classes(classes) {
        this.state_proxy.visible_classes = classes;
    }

    @action
    select_taxonomy_class(id) {
        this.state_proxy.selected_taxonomy_class_id = id;
    }

    @action
    set_mode(mode) {
        if (Object.values(MODE).indexOf(mode) > -1) {
            this.state_proxy.mode = mode;
        } else {
            throw Error(`The mode ${mode} is not a valid mode within this application`);
        }
    }

}
