const {element, text_node, button} = require('./dom');
import {NOTIFICATION_LIFE_SPAN_MS} from '../domain/constants.js';

const root = document.body;
const remove_notif = notif => { notif.parentNode.removeChild(notif); };

const make_notif = (text_content, close_on_click = false) => {
    const notif = element('div');
    notif.classList.add('notification');
    const p = element('p', text_node(text_content));
    notif.appendChild(p);
    if (close_on_click) {
        notif.addEventListener('click', () => {
            remove_notif(notif);
        });
        setTimeout(() => { remove_notif(notif); }, NOTIFICATION_LIFE_SPAN_MS)
    }
    return notif;
};

const create_keyup_listener = (notif, resolve, reject) => {
    const event_listener = (event) => {
        const key = event.key;
        switch (key) {
            case 'Escape':
                remove_notif(notif);
                removeEventListener('keyup', event_listener);
                reject();
                break;
            case 'Enter':
                remove_notif(notif);
                removeEventListener('keyup', event_listener);
                resolve();
                break;
        }
    };
    return event_listener;
};

export const notifier = {
    error: text => {
        const notif = make_notif(text, true);
        notif.classList.add('error');
        root.appendChild(notif);
    },
    confirm: text => {
        return new Promise((resolve, reject) => {
            const notif = make_notif(text);
            const listener = create_keyup_listener(notif, resolve, reject);
            addEventListener('keyup', listener);
            notif.classList.add('confirm');
            const yes = button(text_node('Confirm'), () => {
                removeEventListener('keyup', listener);
                remove_notif(notif);
                resolve();
            });
            const no = button(text_node('Cancel'), () => {
                removeEventListener('keyup', listener);
                remove_notif(notif);
                reject();
            });
            const div = element('div');
            div.classList.add('actions');
            div.appendChild(yes);
            div.appendChild(no);
            notif.appendChild(div);
            root.appendChild(notif);
        });
    },
    warning: text => {
        const notif = make_notif(text, true);
        notif.classList.add('warning');
        root.appendChild(notif);
    },
    ok: text => {
        const notif = make_notif(text, true);
        notif.classList.add('ok');
        root.appendChild(notif);
    },
};