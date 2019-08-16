// @flow strict

import {observable, configure} from 'mobx';
import {GeoImageNetStore} from './GeoImageNetStore.js';

/**
 * We want to be able to either create a state proxy without parameters, for usage in the real time application,
 * or pass a custom GeoImageNetStore to the observable, when testing.
 */

export const create_state_proxy = (store_schematics: GeoImageNetStore | null = null) => {

    if (store_schematics === null) {
        return observable.object(new GeoImageNetStore());
    }

    return observable.object(store_schematics);

};

export {StoreActions} from './StoreActions.js';

/**
 * this is relatively important in the sense that it constraints us to mutate the store only in actions
 * otherwise, changing the store, affecting the state each time, can be compared to an open heart hemorrhage
 */
configure({
    enforceActions: 'always',
});
