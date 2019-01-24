export const toggle_all_nested_checkboxes = (parent, checked) => {
    const checkboxes = parent.querySelectorAll('input[type=checkbox]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = checked;
    });
};

export const element = (elem, content) => {
    const e = document.createElement(elem);
    if (content) {
        e.appendChild(content);
    }
    return e;
};
export const text_node = text => document.createTextNode(text);
export const get_by_id = id => document.getElementById(id);

export const span = (content, ...class_name) => {
    const s = element('span');
    if (content) {
        s.appendChild(content);
    }
    if (class_name) {
        s.classList.add(...class_name);
    }
    return s;
};
export const button = (content, click_handler) => {
    const b = element('button');
    b.appendChild(content);
    if (click_handler) {
        b.addEventListener('click', click_handler);
    }
    return b;
};
export const checkbox = (value, change_handler) => {
    const c = element('input');
    c.type = 'checkbox';
    c.value = value;
    c.addEventListener('change', change_handler);
    return c;
};

export const remove_children = elem => {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
};
export const stylable_checkbox = (checkbox_value, label_class, change_handler) => {
    const label = element('label');
    label.classList.add(label_class);
    label.appendChild(checkbox(checkbox_value, change_handler));
    label.appendChild(element('span'));
    return label;
};
