import {MODE} from '/js/constants.js';

export const store = mobx.observable({
    mode: MODE.VISUALIZE,
});

export const set_mode = mobx.action(mode => {
    if (Object.values(MODE).indexOf(mode) > -1) {
        store.mode = mode;
    } else {
        throw Error('The mode ' + mode + ' is not a valid mode within this application');
    }
});
