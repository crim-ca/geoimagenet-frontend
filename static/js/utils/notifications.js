import {element, text_node, button} from '/js/utils/dom.js'

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
        })
    }
    return notif;
};

export const notifier = {
    err: text => {
        const notif = make_notif(text, true);
        notif.classList.add('error');
        root.appendChild(notif);
    },
    confirm: text => {
        return new Promise((resolve, reject) => {
            const notif = make_notif(text);
            notif.classList.add('confirm');
            const yes = button(text_node('Confirm'), () => {
                remove_notif(notif);
                resolve();
            });
            const no = button(text_node('Cancel'), () => {
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
    warn: text => {
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
