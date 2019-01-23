import {element, text_node, button} from '/js/utils/dom.js'

const root = document.body;

export const notifier = {
    err: text => {
        const div = element('div');
        div.appendChild(text_node(text));
        root.appendChild(div);
    },
    confirm: text => {
        return new Promise((resolve, reject) => {
            const notif = element('div');
            const p = element('p', text_node(text));
            notif.appendChild(p);
            const yes = button(text_node('Confirm'), () => {
                notif.parentNode.removeChild(notif);
                resolve();
            });
            const no = button(text_node('Cancel'), () => {
                notif.parentNode.removeChild(notif);
                reject();
            });
            const div = element('div');
            div.classList.add('actions');
            div.appendChild(yes);
            div.appendChild(no);
            notif.appendChild(div);
            notif.classList.add('notification');
            root.appendChild(notif);
        });
    },
};
