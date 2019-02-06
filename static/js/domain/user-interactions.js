import {
    set_annotation_counts,
    set_selected_taxonomy,
    set_taxonomy_class,
    toggle_taxonomy_class_tree_element
} from './store.js';
import {
    flat_taxonomy_classes_counts,
    nested_taxonomy_classes,
    release_annotations_request
} from './data-queries.js';
import {notifier} from '../utils/notifications.js';
import {refresh_source_by_status} from '../MapManager.js';
import {ANNOTATION} from './constants.js';

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
        set_annotation_counts(counts);
        set_taxonomy_class([taxonomy_classes]);
        toggle_taxonomy_class_tree_element(version['root_taxonomy_class_id']);
    } catch (e) {
        notifier.error('We were unable to fetch the taxonomy classes.');
    }
};

export const release_annotations = async (taxonomy_class_id) => {
    await notifier.confirm('Do you really want to release all the annotations of the selected class, as well as its children?');
    try {
        await release_annotations_request(taxonomy_class_id);
        refresh_source_by_status(ANNOTATION.STATUS.NEW);
        refresh_source_by_status(ANNOTATION.STATUS.RELEASED);
        const counts = await flat_taxonomy_classes_counts(taxonomy_class_id);
        set_annotation_counts(counts);
        notifier.ok('Annotations were released.');
    } catch (error) {
        notifier.error('We were unable to release the annotations.')
    }
};
