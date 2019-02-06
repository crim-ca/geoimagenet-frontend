import {
    toggle_all_nested_checkboxes,
    get_by_id,
    element,
    text_node,
    button,
    span,
    remove_children,
    stylable_checkbox, xpath_query
} from './utils/dom.js';
import {
    store,
    select_taxonomy_class,
    set_visible_classes, toggle_taxonomy_class_tree_element
} from './store.js';
import {ANNOTATION} from './constants.js';
import {
    select_taxonomy,
    release_annotations
} from './domain/user-interactions.js';


export class TaxonomyBrowser {

    constructor() {

        this.taxonomy_classes_root = get_by_id('taxonomy_classes');
        this.taxonomy_root = get_by_id('taxonomy');

        this.toggle_visible_classes_click_handler = this.toggle_visible_classes_click_handler.bind(this);

        mobx.autorun(() => {
            remove_children(this.taxonomy_root);
            store.taxonomy.forEach(taxonomy => {
                const version = taxonomy['versions'][0];
                const b = button(text_node(taxonomy['name']), async () => {
                    await select_taxonomy(version, taxonomy['name']);
                });
                this.taxonomy_root.appendChild(b);
            });
        });

        mobx.autorun(() => {
            this.build_taxonomy_classes_list(store.selected_taxonomy.elements, store.annotation_counts);
        });
    }

    build_taxonomy_classes_list(elements, counts) {
        remove_children(this.taxonomy_classes_root);
        this.construct_children(this.taxonomy_classes_root, elements, counts);
        this.check_all_checkboxes();
        this.update_visible_classes_from_checked_checkboxes();
    }

    update_visible_classes_from_checked_checkboxes() {
        const selection = [];
        const checkboxes = this.taxonomy_classes_root.querySelectorAll('input[type=checkbox]:checked');
        checkboxes.forEach(checkbox => {
            selection.push(checkbox.value);
        });
        set_visible_classes(selection);
    }

    toggle_visible_classes_click_handler(event) {
        const parent_list_item = xpath_query(
            "./ancestor::span[contains(concat(' ', @class, ' '), ' taxonomy_class_list_element ')]/ancestor::li[1]",
            event.target
        );
        toggle_all_nested_checkboxes(parent_list_item, event.target.checked);

        this.update_visible_classes_from_checked_checkboxes();
    }

    check_all_checkboxes() {
        this.taxonomy_classes_root.querySelectorAll('input[type=checkbox]').forEach(c => {
            c.checked = true;
        });
    }

    construct_children(this_level_root, collection, counts) {
        collection.forEach(taxonomy_class => {
            const taxonomy_class_root_element = element('li');
            const taxonomy_class_list_element = element('span');
            taxonomy_class_list_element.classList.add('taxonomy_class_list_element');
            const text = element('span');

            text.appendChild(text_node(taxonomy_class.name));
            const taxonomy_class_counts = counts[taxonomy_class.id];
            if (taxonomy_class_counts[ANNOTATION.STATUS.NEW]) {
                text.appendChild(span(text_node(taxonomy_class_counts[ANNOTATION.STATUS.NEW]), 'annotation_new'));
            }
            if (taxonomy_class_counts[ANNOTATION.STATUS.RELEASED]) {
                text.appendChild(span(text_node(taxonomy_class_counts[ANNOTATION.STATUS.RELEASED]), 'annotation_released'));
            }
            if (taxonomy_class_counts[ANNOTATION.STATUS.VALIDATED]) {
                text.appendChild(span(text_node(taxonomy_class_counts[ANNOTATION.STATUS.VALIDATED]), 'annotation_validated'));
            }

            const actions = span(null, 'actions');
            actions.appendChild(stylable_checkbox(taxonomy_class.id, 'checkbox_eye', this.toggle_visible_classes_click_handler));
            actions.appendChild(button(
                span(null, 'fas', 'fa-paper-plane', 'fa-lg', 'release'),
                () => release_annotations(taxonomy_class.id)
            ));

            taxonomy_class_list_element.appendChild(text);
            taxonomy_class_list_element.appendChild(actions);

            taxonomy_class_root_element.appendChild(taxonomy_class_list_element);

            // TODO only leafs can be annotated, so if taxonomy_class.children don't add the possibility to select for annotation
            if (taxonomy_class['children'] && taxonomy_class['children'].length > 0) {
                if (!taxonomy_class['opened']) {
                    taxonomy_class_root_element.classList.add('collapsed');
                }
                // inside the if block because we don't need the toggle if there are no children
                text.addEventListener('click', () => {
                    toggle_taxonomy_class_tree_element(taxonomy_class.id);
                });

                const ul = element('ul');
                this.construct_children(ul, taxonomy_class['children'], counts);
                taxonomy_class_root_element.appendChild(ul);
            } else {
                text.addEventListener('click', event => {
                    select_taxonomy_class(taxonomy_class['id']);
                    this.taxonomy_classes_root.querySelectorAll('.selected').forEach(elem => {
                        elem.classList.remove('selected');
                    });
                    event.target.parentNode.classList.add('selected');
                });
            }

            this_level_root.appendChild(taxonomy_class_root_element);
        });
    }
}
