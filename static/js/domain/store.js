import {ANNOTATION, MODE} from './constants.js';

export const store = mobx.observable({

    mode: MODE.VISUALIZE,

    taxonomy: [],
    annotation_counts: {},
    selected_taxonomy: {
        id: 0,
        name: '',
        version: 0,
        elements: [],
        root_taxonomy_class_id: 0,
    },
    selected_taxonomy_class_id: -1,
    visible_classes: [],

    annotations_collections: {},
    annotations_sources: {},
    annotations_layers: {},

    current_annotation: {
        initialized: false,
        image_title: ''
    },

});

const find_element_by_id = (collection, target_id) => {

    // Here, we work around the fact that array.find returns the first result of the array
    // It would work perfectly on a flat array, but here, if the result is nested, returning true from the inner loop,
    // makes the outer loop element be returned from the find
    // hence, when we find the element, we assign it to result and return true to exit the loop
    // this makes finding the element some kind of side effect of the find, instead of its primary function
    const loop = (collection, target_id, result) => {
        collection.find(e => {
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

export const toggle_taxonomy_class_tree_element = mobx.action(taxonomy_class_id => {
    let taxonomy_class = find_element_by_id(store.selected_taxonomy.elements, taxonomy_class_id);
    taxonomy_class['opened'] = !taxonomy_class['opened'];
});

export const set_taxonomy_classes_visibility = mobx.action((taxonomy_class_ids) => {
    taxonomy_class_ids.forEach(id => {
        let taxonomy_class = find_element_by_id(store.selected_taxonomy.elements, id);
        taxonomy_class['visible'] = !taxonomy_class['visible'];
    });
});

export const increment_new_annotations_count = mobx.action(taxonomy_class_id => {
    store.annotation_counts[taxonomy_class_id][ANNOTATION.STATUS.NEW]++;
});

export const start_annotation = mobx.action(image_title => {
    store.current_annotation.initialized = true;
    store.current_annotation.image_title = image_title;
});
export const end_annotation = mobx.action(() => {
    store.current_annotation.initialized = false;
    store.current_annotation.image_title = '';
});

export const set_annotation_counts = mobx.action(counts => {
    store.annotation_counts = Object.assign({}, store.annotation_counts, counts);
});
export const set_annotation_collection = mobx.action((key, collection) => {
    store.annotations_collections[key] = collection;
});
export const set_annotation_source = mobx.action((key, source) => {
    store.annotations_sources[key] = source;
});
export const set_annotation_layer = mobx.action((key, layer) => {
    store.annotations_layers[key] = layer;
});
export const set_taxonomy = mobx.action(t => {
    store.taxonomy = t;
});
export const set_selected_taxonomy = mobx.action(t => {
    store.selected_taxonomy = t;
});
export const set_taxonomy_class = mobx.action(c => {
    store.selected_taxonomy.elements = c;

    const flat_ancestors_and_descendants_dict = {};
    const flatten_ancestors_and_descendants = (taxonomy_class) => {
        if (taxonomy_class.children && taxonomy_class.children.length > 0) {
            const id = taxonomy_class.id;
            taxonomy_class.children.forEach(e => {
                if (flat_ancestors_and_descendants_dict[id]) {
                    flat_ancestors_and_descendants_dict[id].push(e.id);
                } else {
                    flat_ancestors_and_descendants_dict[id] = [e.id];
                }
                if (e.children && e.children.length > 0) {
                    flatten_ancestors_and_descendants(e);
                }
            });
        }
    };
    store.selected_taxonomy.elements.forEach(e => { flatten_ancestors_and_descendants(e); });
});
export const set_visible_classes = mobx.action((classes) => {
    store.visible_classes = classes;
});
export const select_taxonomy_class = mobx.action(id => {
    store.selected_taxonomy_class_id = id;
});

export const set_mode = mobx.action(mode => {
    if (Object.values(MODE).indexOf(mode) > -1) {
        store.mode = mode;
    } else {
        throw Error(`The mode ${mode} is not a valid mode within this application`);
    }
});
