import {set_selected_taxonomy, set_taxonomy_class} from '../store.js';
import {fetch_taxonomy_classes_by_root_class_id} from '../data-queries.js';
import {notifier} from '../utils/notifications.js';

export const select_taxonomy = async (version, taxonomy_name) => {
    set_selected_taxonomy({
        id: version['taxonomy_id'],
        name: taxonomy_name,
        version: version['version'],
        root_taxonomy_class_id: version['root_taxonomy_class_id'],
        elements: [],
    });
    try {
        const taxonomy_classes = await fetch_taxonomy_classes_by_root_class_id(version['root_taxonomy_class_id']);
        set_taxonomy_class([taxonomy_classes]);
    } catch (e) {
        notifier.error('We were unable to fetch the taxonomy classes.');
    }
};
