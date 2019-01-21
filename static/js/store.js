import {MODE} from '/js/constants.js';

export const store = mobx.observable({
    mode: MODE.VISUALIZE,
    taxonomy: [],
    taxonomy_class: [],
});

export const set_taxonomy = mobx.action(t => {
    store.taxonomy = t;
});
export const set_taxonomy_class = mobx.action(c => {
    store.taxonomy_class = c;
});

export const set_mode = mobx.action(mode => {
    if (Object.values(MODE).indexOf(mode) > -1) {
        store.mode = mode;
    } else {
        throw Error(`The mode ${mode} is not a valid mode within this application`);
    }
});
