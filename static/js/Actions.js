import {get_by_id, button, remove_children, span} from './utils/dom.js';
import {store, set_mode} from './store.js';
import {MODE} from './constants.js';

const actions = [
    {name: 'eye', icon_class: 'fa-eye', mode: MODE.VISUALIZE},
    {name: 'creation', icon_class: 'fa-plus-square', mode: MODE.CREATION},
    {name: 'duplicate', icon_class: 'fa-copy', mode: MODE.DUPLICATE},
    {name: 'modify', icon_class: 'fa-edit', mode: MODE.MODIFY},
    {name: 'delete', icon_class: 'fa-trash-alt', mode: MODE.DELETE},
    {name: 'ask_expertise', icon_class: 'fa-question-circle', mode: MODE.ASK_EXPERTISE},
    {name: 'validate', icon_class: 'fa-check', mode: MODE.VALIDATE},
    {name: 'refuse', icon_class: 'fa-times', mode: MODE.REFUSE},
];

export const build_actions = () => {

    const actions_root = get_by_id('actions');

    mobx.autorun(() => {
        remove_children(actions_root);
        actions.forEach(action => {
            const icon = span(null, 'fas', action.icon_class, 'fa-2x');
            if (action.mode === store.mode) {
                icon.classList.add('active');
            }
            const b = button(icon, () => {
                set_mode(action.mode);
            });
            actions_root.appendChild(b);
        });
    });

};
