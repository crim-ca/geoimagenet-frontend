import {get_by_id, button, element, remove_children} from '/js/Utils.js';
import {store, set_mode} from '/js/store.js';
import {MODE} from '/js/constants.js';

const actions = [
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
    const mode_indicator = get_by_id('mode_indicator');

    mobx.autorun(() => {
        mode_indicator.innerHTML = `Current mode: ${store.mode}`;
    });

    mobx.autorun(() => {
        remove_children(actions_root);
        actions.forEach(action => {
            const span = element('span');
            span.classList.add('fas', action.icon_class, 'fa-2x');
            if (action.mode === store.mode) {
                span.classList.add('active');
            }
            const b = button(span, () => {
                set_mode(action.mode)
            });
            actions_root.appendChild(b);
        });
    });

};
