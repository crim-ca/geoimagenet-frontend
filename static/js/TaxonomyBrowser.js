import {
    toggle_all_nested_checkboxes,
    element,
    text_node,
    button,
    checkbox,
    span,
    remove_children
} from '/js/Utils.js';
import {store, set_taxonomy, set_taxonomy_class} from '/js/store.js';

export class TaxonomyBrowser {

    constructor(taxonomy, mapManager) {

        this.mapManager = mapManager;
        this.classes_element = document.getElementById('taxonomy_classes');
        this.selection = [];
        this.annotation_is_activated = false;

        const update_selection = mobx.action(() => {
            this.selection = [];
            const checkboxes = this.classes_element.querySelectorAll('input[type=checkbox]:checked');
            checkboxes.forEach(checkbox => {
                this.selection.push(checkbox.value);
            });
        });

        this.check_visibility = (event) => {

            /*
            when checking a checkbox, there can be children to be checked down the tree first
            then, add source event value, along with all children values, to the cql filter
             */

            // ugly going forward because we need to go search the right elem
            toggle_all_nested_checkboxes(event.target.parentNode.parentNode.parentNode, event.target.checked);

            update_selection();
            event = new CustomEvent('selection_changed', {detail: this.selection});
            dispatchEvent(event);
        };

        this.activate_annotation = () => {
            if (!this.annotation_is_activated) {
                this.mapManager.activate_interactions();
                this.annotation_is_activated = true;
            }
        };

        fetch(`/taxonomy`)
            .then(res => res.json())
            .then(json => {
                set_taxonomy(json);
            })
            .catch(err => console.log(err));

        const taxonomy_table = document.getElementById('taxonomy_root');

        mobx.autorun(() => {
            store.taxonomy.forEach(taxonomy => {

                const taxonomy_row = element('tr');
                const name_cell = element('td');
                const version_cell = element('td');
                const action_cell = element('td');
                const load_taxonomy = button(text_node('Charger'), () => {load_taxonomy_by_id(taxonomy['id'])});

                name_cell.appendChild(text_node(taxonomy['name']));
                version_cell.appendChild(text_node(taxonomy['version']));
                action_cell.appendChild(load_taxonomy);

                taxonomy_row.appendChild(version_cell);
                taxonomy_row.appendChild(name_cell);
                taxonomy_row.appendChild(action_cell);

                taxonomy_table.appendChild(taxonomy_row);

            });
        });

        mobx.autorun(() => {
            remove_children(this.classes_element);
            this.construct_children(this.classes_element, store.taxonomy_class);
        });

        const load_taxonomy_by_id = mobx.action(id => {
            fetch(`/taxonomy/${id}`)
                .then(res => res.json())
                .then(json => {
                    set_taxonomy_class(json);
                })
                .catch(err => console.log(err));
        });
    }

    construct_children(this_level_root, collection) {
        collection.forEach(taxonomy_class => {
            const taxonomy_class_root_element = element('li');

            const taxonomy_class_list_element = element('span');
            taxonomy_class_list_element.classList.add('taxonomy_class_list_element');

            const text = element('span');

            text.appendChild(text_node(taxonomy_class.name));
            if (taxonomy_class['count_new']) {
                text.appendChild(span(text_node(taxonomy_class['count_new']), 'annotation_new'));
            }
            if (taxonomy_class['count_released']) {
                text.appendChild(span(text_node(taxonomy_class['count_released']), 'annotation_released'));
            }
            if (taxonomy_class['count_validated']) {
                text.appendChild(span(text_node(taxonomy_class['count_validated']), 'annotation_validated'));
            }

            const label = element('label');
            label.appendChild(checkbox(taxonomy_class.id, this.check_visibility));
            label.appendChild(element('span'));

            /*
            const radio_selector = element('input');
            radio_selector.type = 'radio';
            radio_selector.value = taxonomy_class.id;
            radio_selector.name = 'selected_taxonomy';
            radio_selector.addEventListener('change', this.activate_annotation);
            */

            taxonomy_class_list_element.appendChild(text);
            taxonomy_class_list_element.appendChild(label);

            taxonomy_class_root_element.appendChild(taxonomy_class_list_element);

            // taxonomy_class_root_element.appendChild(radio_selector);

            // TODO only leafs can be annotated, so if taxonomy_class.children don't add the possibility to select for annotation


            if (taxonomy_class['children'] && taxonomy_class['children'].length > 0) {
                taxonomy_class_root_element.classList.add('collapsed');
                // inside the if block because we don't need the toggle if there are no children
                text.addEventListener('click', event => {
                    // ugly following the chain upwards until the parent li
                    event.target.parentNode.parentNode.classList.toggle('collapsed');
                });

                const ul = element('ul');
                this.construct_children(ul, taxonomy_class['children']);
                taxonomy_class_root_element.appendChild(ul);
            }

            this_level_root.appendChild(taxonomy_class_root_element);
        });
    }
}
