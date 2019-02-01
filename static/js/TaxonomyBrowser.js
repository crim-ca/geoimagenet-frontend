import {
    toggle_all_nested_checkboxes,
    get_by_id,
    element,
    text_node,
    button,
    span,
    remove_children,
    stylable_checkbox
} from './utils/dom.js';
import {
    store,
    set_taxonomy,
    set_taxonomy_class,
    select_taxonomy_class,
    set_selected_taxonomy,
    set_visible_classes
} from './store.js';
import {notifier} from "./utils/notifications.js";
import {make_http_request} from "./utils/http.js";
import {release_annotations_by_taxonomy_class_id} from './data-queries.js'

export class TaxonomyBrowser {

    constructor(map_manager) {

        this.taxonomy_classes_root = get_by_id('taxonomy_classes');
        this.taxonomy_root = get_by_id('taxonomy');
        this.map_manager = map_manager;

        this.toggle_classes_click_handler = (event) => {
            /*
            when checking a checkbox, there can be children to be checked down the tree first
            then, add source event value, along with all children values, to the cql filter
             */

            // ugly going forward because we need to go search the right elem
            // FIXME dude seriously. do something, maybe find_parent_by_tagname or whatevs
            toggle_all_nested_checkboxes(event.target.parentNode.parentNode.parentNode.parentNode, event.target.checked);

            const selection = [];
            const checkboxes = this.taxonomy_classes_root.querySelectorAll('input[type=checkbox]:checked');
            checkboxes.forEach(checkbox => {
                selection.push(checkbox.value);
            });
            set_visible_classes(selection);
        };

        this.release_annotations_user_interaction = taxonomy_class_id => {
            notifier.confirm("Do you really want to release all the annotations of the selected class, as well as its children?")
                .then(() => {
                    release_annotations_by_taxonomy_class_id(taxonomy_class_id)
                        .then(() => {
                            notifier.ok('Annotations were released.');
                            this.map_manager.refresh();
                        })
                        .catch(() => {
                            notifier.err('We were unable to release the annotations.')
                        });
                });
        };

        make_http_request(`${GEOIMAGENET_API_URL}/taxonomy`)
            .then(res => res.json())
            .then(json => {
                set_taxonomy(json);
            })
            .catch(err => console.log(err));

        mobx.autorun(() => {
            remove_children(this.taxonomy_root);
            store.taxonomy.forEach(taxonomy => {
                const version = taxonomy['versions'][0];
                const b = button(text_node(taxonomy['name']), () => {
                    set_selected_taxonomy({
                        id: version['taxonomy_id'],
                        name: taxonomy['name'],
                        version: version['version'],
                        taxonomy_class_root_id: version['taxonomy_class_root_id'],
                        elements: [],
                    });
                    load_taxonomy_by_id(version['taxonomy_class_root_id']);
                });
                this.taxonomy_root.appendChild(b);
            });
        });

        mobx.autorun(() => {
            remove_children(this.taxonomy_classes_root);
            this.construct_children(this.taxonomy_classes_root, store.selected_taxonomy.elements, true);
            this.check_all_checkboxes_hack();
        });

        const load_taxonomy_by_id = (taxonomy_class_root_id) => {
            let url = `${GEOIMAGENET_API_URL}/taxonomy_classes/${taxonomy_class_root_id}`;
            make_http_request(url)
                .then(res => res.json())
                .then(json => {
                    set_taxonomy_class([json]);
                })
                .catch(err => console.log(err));
        };
    }

    check_all_checkboxes_hack() {
        this.taxonomy_classes_root.querySelectorAll('input[type=checkbox]').forEach(c => {
            c.checked = true;
        });
        const selection = [];
        const checkboxes = this.taxonomy_classes_root.querySelectorAll('input[type=checkbox]:checked');
        checkboxes.forEach(checkbox => {
            selection.push(checkbox.value);
        });
        set_visible_classes(selection);
    }

    construct_children(this_level_root, collection, level_is_opened = false) {
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

            const actions = span(null, 'actions');
            actions.appendChild(stylable_checkbox(taxonomy_class.id, 'checkbox_eye', this.toggle_classes_click_handler));
            actions.appendChild(button(
                span(null, 'fas', 'fa-paper-plane', 'fa-lg', 'release'),
                () => this.release_annotations_user_interaction(taxonomy_class.id)
            ));

            taxonomy_class_list_element.appendChild(text);
            taxonomy_class_list_element.appendChild(actions);

            taxonomy_class_root_element.appendChild(taxonomy_class_list_element);

            // TODO only leafs can be annotated, so if taxonomy_class.children don't add the possibility to select for annotation
            if (taxonomy_class['children'] && taxonomy_class['children'].length > 0) {
                if (!level_is_opened) {
                    taxonomy_class_root_element.classList.add('collapsed');
                }
                // inside the if block because we don't need the toggle if there are no children
                text.addEventListener('click', event => {
                    // ugly following the chain upwards until the parent li
                    event.target.parentNode.parentNode.classList.toggle('collapsed');
                });

                const ul = element('ul');
                this.construct_children(ul, taxonomy_class['children']);
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
