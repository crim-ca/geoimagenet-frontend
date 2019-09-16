// @flow strict

import type {ContextualMenuItem, PopulateContextualMenuCallback} from "../../Types";

class ContextualMenuManager {
    populate_menu_callback: PopulateContextualMenuCallback | null = null;

    register_populate_menu_callback = (callback: PopulateContextualMenuCallback) => {
        if (typeof callback !== 'function') {
            throw new Error('The populate menu callback should be a function.');
        }
        if (this.populate_menu_callback !== null) {
            throw new Error('There should only be one registered populate menu callback at a time. ' +
                'Only one ContextualMenuContainer should be used at a time, are you trying to instantiate multiple ones?');
        }
        this.populate_menu_callback = callback;
    };

    remove_populate_menu_callback = () => {
        this.populate_menu_callback = null;
    };

    choose_option: (ContextualMenuItem[]) => Promise<void> = (menu_items: ContextualMenuItem[]) => {
        return new Promise((resolve, reject) => {

            if (menu_items.length < 2) {
                reject('You should ask for at least two options for the user to choose from.');
            }

            if (typeof this.populate_menu_callback === 'function') {
                return this.populate_menu_callback(menu_items, resolve, reject);
            }
            if (this.populate_menu_callback === null) {
                reject('There is no populate menu callback registered. Did you instantiate a ContextualMenuContainer?');
            }
            reject('The populate menu callback registered is not a function. ' +
                'Did you instantiate a ContextualMenuContainer?');
        });
    };

}

const instance = new ContextualMenuManager();
export {instance as ContextualMenuManager};
