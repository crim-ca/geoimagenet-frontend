export class TaxonomyBrowser {

    constructor(taxonomy, mapManager) {

        this.mapManager = mapManager;
        this.classes_element = document.getElementById('taxonomy_classes');
        this.selection = [];
        this.annotation_is_activated = false;

        this.store = mobx.observable({
            taxonomy: [],
            taxonomy_class: []
        });

        this.fire_selection_changed = (event) => {
            // receive the checkbox selection event and manage activation state
            // if the checkbox is checked, add it to the selection
            // if it's not, remove it
            console.log('checkbox has been checked. event: %o, checked: %o', event, event.target.checked);
            if (event.target.checked) {
                this.selection.push(event.target.value);
            } else {
                delete this.selection[this.selection.indexOf(event.target.value)];
            }
            event = new CustomEvent('selection_changed', {detail: this.selection});
            dispatchEvent(event);
        };

        this.activate_annotation = () => {
            if (!this.annotation_is_activated) {
                this.mapManager.activate_interactions();
                this.annotation_is_activated = true;
            }
        };

        this.reset_taxonomy_elements = () => {
            while (this.classes_element.firstChild) {
                this.classes_element.removeChild(this.classes_element.firstChild);
            }
        };

        fetch(`/taxonomy`)
            .then(res => res.json())
            .then(json => {
                this.store.taxonomy = json;
            })
            .catch(err => console.log(err));

        const taxonomy_table = document.getElementById('taxonomy_root');

        mobx.autorun(() => {
            this.store.taxonomy.forEach(taxonomy => {

                const taxonomy_row = document.createElement('tr');
                const name_cell = document.createElement('td');
                const version_cell = document.createElement('td');
                const action_cell = document.createElement('td');
                const load_taxonomy_action = document.createElement('button');

                load_taxonomy_action.appendChild(document.createTextNode('Charger'));
                load_taxonomy_action.addEventListener('click', () => {
                    load_taxonomy_by_id(taxonomy['id']);
                });

                name_cell.appendChild(document.createTextNode(taxonomy['name']));
                version_cell.appendChild(document.createTextNode(taxonomy['version']));
                action_cell.appendChild(load_taxonomy_action);

                taxonomy_row.appendChild(version_cell);
                taxonomy_row.appendChild(name_cell);
                taxonomy_row.appendChild(action_cell);

                taxonomy_table.appendChild(taxonomy_row);

            });
        });

        mobx.autorun(() => {
            this.construct_children(this.classes_element, this.store.taxonomy_class);
        });

        const load_taxonomy_by_id = mobx.action(id => {
            fetch(`/taxonomy/${id}`)
                .then(res => res.json())
                .then(json => {
                    this.reset_taxonomy_elements();
                    this.store.taxonomy_class = json;
                })
                .catch(err => console.log(err));
        });
    }

    construct_children(element, collection) {
        collection.forEach(taxonomy_class => {
            const li = document.createElement('li');

            const text = document.createElement('span');
            text.appendChild(document.createTextNode(taxonomy_class.name));
            li.appendChild(text);

            const label = document.createElement('label');
            const checkbox_input = document.createElement('input');
            const span = document.createElement('span');
            checkbox_input.type = 'checkbox';
            checkbox_input.value = taxonomy_class.id;
            checkbox_input.addEventListener('change', this.fire_selection_changed);
            label.appendChild(checkbox_input);
            label.appendChild(span);

            /*
            const radio_selector = document.createElement('input');
            radio_selector.type = 'radio';
            radio_selector.value = taxonomy_class.id;
            radio_selector.name = 'selected_taxonomy';
            radio_selector.addEventListener('change', this.activate_annotation);
            */

            li.appendChild(label);
            // li.appendChild(radio_selector);

            // TODO only leafs can be annotated, so if taxonomy_class.children don't add the possibility to select for annotation


            if (taxonomy_class['children'] && taxonomy_class['children'].length > 0) {
                li.classList.add('collapsed');
                // inside the if block because we don't need the toggle if there are no children
                text.addEventListener('click', event => {
                    event.target.parentNode.classList.toggle('collapsed');
                });

                const ul = document.createElement('ul');
                this.construct_children(ul, taxonomy_class['children']);
                li.appendChild(ul);
            }
            element.appendChild(li);
        });
    }
}
