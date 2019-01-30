import {MODE} from '/js/constants.js';

export const store = mobx.observable({
    mode: MODE.VISUALIZE,
    taxonomy: [],
    selected_taxonomy: {
        id: 0,
        name: '',
        version: 0,
        elements: [],
    },
    selected_taxonomy_class_id: -1,
    visible_classes: [],
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
