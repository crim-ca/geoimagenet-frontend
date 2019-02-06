import {set_selected_taxonomy, set_taxonomy_class} from '../store.js';
import {
    flat_taxonomy_classes_counts,
    nested_taxonomy_classes
} from './data-queries.js';
import {notifier} from '../utils/notifications.js';
import {xpath_query} from '../utils/dom.js';

const build_counts = (taxonomy_class, counts) => {
    const taxonomy_class_id = taxonomy_class['id'];
    if (counts[taxonomy_class_id]) {
        taxonomy_class['counts'] = counts[taxonomy_class_id];
    }
    if (taxonomy_class['children'] && taxonomy_class['children'].length > 0) {
        taxonomy_class['children'].forEach(t => {
            build_counts(t, counts);
        });
    }
};

export const select_taxonomy = async (version, taxonomy_name) => {
    set_selected_taxonomy({
        id: version['taxonomy_id'],
        name: taxonomy_name,
        version: version['version'],
        root_taxonomy_class_id: version['root_taxonomy_class_id'],
        elements: [],
    });
    try {
        // TODO eventually make both requests under a Promise.all as they are not co-dependant
        const taxonomy_classes = await nested_taxonomy_classes(version['root_taxonomy_class_id']);
        const counts = await flat_taxonomy_classes_counts(version['root_taxonomy_class_id']);
        build_counts(taxonomy_classes, counts);
        set_taxonomy_class([taxonomy_classes]);
    } catch (e) {
        notifier.error('We were unable to fetch the taxonomy classes.');
    }
};

export const toggle_taxonomy_tree_element = (event) => {
    // ugly following the chain upwards until the parent li
    xpath_query('./ancestor::*[2]', event.target).classList.toggle('collapsed');
};
