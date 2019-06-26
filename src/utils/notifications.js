const {element, text_node, button} = require('./dom');
import {NOTIFICATION_LIFE_SPAN_MS} from '../domain/constants.js';
import 'react-notifications/lib/notifications.css';

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
        setTimeout(() => { remove_notif(notif); }, NOTIFICATION_LIFE_SPAN_MS);
    }
    return notif;
};

const create_keyup_listener = (notif, resolve, reject) => {
    const event_listener = (event) => {
        const key = event.key;
        switch (key) {
            case 'Escape':
                remove_notif(notif);
                window.removeEventListener('keyup', event_listener);
                reject();
                break;
            case 'Enter':
                remove_notif(notif);
                window.removeEventListener('keyup', event_listener);
                resolve();
                break;
        }
    };
    return event_listener;
};

/**
 * The notifier should be a "global" handler with which various parts or the application interact to notify the user about events.
 * We currently hook directly to document.body to create the confirm dialog since it's not supported in react-notifications.
 */
export const notifier = {
    confirm: text => {
        return new Promise((resolve, reject) => {
            const notif = make_notif(text);
            const listener = create_keyup_listener(notif, resolve, reject);
            window.addEventListener('keyup', listener);
            notif.classList.add('confirm');
            const yes = button(text_node('Confirm'), () => {
                window.removeEventListener('keyup', listener);
                remove_notif(notif);
                resolve();
            });
            const no = button(text_node('Cancel'), () => {
                window.removeEventListener('keyup', listener);
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
};
