// @flow

import {NOTIFICATION_LIFE_SPAN_MS} from '../domain/constants.js';
import 'react-notifications/lib/notifications.css';

const root: HTMLBodyElement = document.body;
const remove_notif = (notification: HTMLElement) => {
    const parent = notification.parentNode;
    if (parent) {
        parent.removeChild(notification);
    }
};

const make_notif = (text_content, close_on_click = false) => {
    const notif = document.createElement('div');
    notif.classList.add('notification');
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(text_content));
    notif.appendChild(p);
    if (close_on_click) {
        notif.addEventListener('click', () => {
            remove_notif(notif);
        });
        setTimeout(() => {
            remove_notif(notif);
        }, NOTIFICATION_LIFE_SPAN_MS);
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
export const notifier: Object = {
    confirm: (text: string) => {
        return new Promise((resolve, reject) => {
            const notif = make_notif(text);
            const listener = create_keyup_listener(notif, resolve, reject);
            window.addEventListener('keyup', listener);
            notif.classList.add('confirm');

            const yes = document.createElement('button');
            yes.appendChild(document.createTextNode('Confirm'));
            yes.addEventListener('click', () => {
                window.removeEventListener('keyup', listener);
                remove_notif(notif);
                resolve();
            });

            const no = document.createElement('button');
            no.appendChild(document.createTextNode('Cancel'));
            no.addEventListener('click', () => {
                window.removeEventListener('keyup', listener);
                remove_notif(notif);
                reject();
            });

            const div = document.createElement('div');
            div.classList.add('actions');
            div.appendChild(yes);
            div.appendChild(no);
            notif.appendChild(div);
            root.appendChild(notif);
        });
    },
};
