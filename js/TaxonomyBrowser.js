import {
    get_by_id,
    element,
    text_node,
    button,
    span,
    remove_children,
    stylable_checkbox, xpath_query
} from './utils/dom.js';
import {autorun} from 'mobx';
import {ANNOTATION} from './domain/constants.js';
import {toggle_all_nested_checkboxes} from "./utils/dom";


export class TaxonomyBrowser {

    constructor(map_manager, state_proxy, store_actions, user_interactions) {

        this.taxonomy_classes_root = get_by_id('taxonomy_classes');
        this.taxonomy_root = get_by_id('taxonomy');
        this.map_manager = map_manager;
        this.state_proxy = state_proxy;
        this.store_actions = store_actions;
        this.user_interactions = user_interactions;

        this.toggle_visible_classes_click_handler = this.toggle_visible_classes_click_handler.bind(this);

        autorun(() => {
            remove_children(this.taxonomy_root);
            this.state_proxy.taxonomy.forEach(taxonomy => {
                const version = taxonomy['versions'][0];
                const b = button(text_node(taxonomy['name']), async () => {
                    await this.user_interactions.select_taxonomy(version, taxonomy['name']);
                });
                this.taxonomy_root.appendChild(b);
            });
        });

        autorun(() => {
            this.build_taxonomy_classes_list(
                this.state_proxy.selected_taxonomy.elements,
                this.state_proxy.annotation_counts
            );
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
        this.store_actions.set_visible_classes(selection);
    }

    toggle_visible_classes_click_handler(event) {
        const parent_list_item = xpath_query(
            "./ancestor::span[contains(concat(' ', @class, ' '), ' taxonomy_class_list_element ')]/ancestor::li[1]",
            event.target
        );
        /*
        const checked_boxes = parent_list_item.querySelectorAll('input:checked[type=checkbox]');
        const values = [];
        checked_boxes.forEach(c => {
            values.push(c.value);
        });
        this.store_actions.set_taxonomy_classes_visibility(values);
        */
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
            actions.appendChild(stylable_checkbox(
                taxonomy_class.id,
                'checkbox_eye',
                this.toggle_visible_classes_click_handler,
                taxonomy_class.visible
            ));
            actions.appendChild(button(
                span(null, 'fas', 'fa-paper-plane', 'fa-lg', 'release'),
                async () => {
                    try {
                        await this.user_interactions.release_annotations(taxonomy_class.id);
                        this.map_manager.refresh_source_by_status(ANNOTATION.STATUS.NEW);
                        this.map_manager.refresh_source_by_status(ANNOTATION.STATUS.RELEASED);
                    } catch (e) {
                        throw e;
                    }
                }
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
                    this.store_actions.toggle_taxonomy_class_tree_element(taxonomy_class.id);
                });

                const ul = element('ul');
                this.construct_children(ul, taxonomy_class['children'], counts);
                taxonomy_class_root_element.appendChild(ul);
            } else {
                text.addEventListener('click', event => {
                    this.store_actions.select_taxonomy_class(taxonomy_class['id']);
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
