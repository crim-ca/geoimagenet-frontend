import {get_parent_by_tag_name} from './dom.js';

export const register_section_handles = (class_name) => {
    document.querySelectorAll(`button.${class_name}`).forEach(b => {
        b.addEventListener('click', e => {
            const parent_section = get_parent_by_tag_name(e.target, 'section');
            document.querySelectorAll('section').forEach(s => {
                s.classList.add('closed');
                s.classList.remove('opened');
            });
            parent_section.classList.remove('closed');
            parent_section.classList.add('opened');
        })
    });
};
