export const toggle_all_nested_checkboxes = (parent, checked) => {
    const checkboxes = parent.querySelectorAll('input[type=checkbox]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = checked;
    });
};

export const element = elem => document.createElement(elem);
export const text_node = text => document.createTextNode(text);

export const button = (text, click_handler) => {
    const b = element('button');
    b.appendChild(text_node(text));
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
