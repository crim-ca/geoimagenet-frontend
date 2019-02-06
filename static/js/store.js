import {ANNOTATION, MODE} from './constants.js';

export const store = mobx.observable({

    mode: MODE.VISUALIZE,

    taxonomy: [],
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

export const increment_new_annotations_count = mobx.action(taxonomy_class_id => {

    const loop_elements = (collection, target_id) => {

        let found = false;

        collection.forEach(element => {
            if (element.id === target_id) {
                element.counts[ANNOTATION.STATUS.NEW]++;
                found = true;
            }
            if (element.children) {
                if (loop_elements(element.children, target_id)) {
                    element.counts[ANNOTATION.STATUS.NEW]++;
                    found = true;
                }
            }
        });

        return found;
    };

    loop_elements(store.selected_taxonomy.elements, taxonomy_class_id);
});

export const start_annotation = mobx.action(image_title => {
    store.current_annotation.initialized = true;
    store.current_annotation.image_title = image_title;
});
export const end_annotation = mobx.action(() => {
    store.current_annotation.initialized = false;
    store.current_annotation.image_title = '';
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
