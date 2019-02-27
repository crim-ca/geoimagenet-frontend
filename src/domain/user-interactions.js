import {
    flat_taxonomy_classes_counts,
    nested_taxonomy_classes,
    release_annotations_request
} from './data-queries.js';
import {notifier} from '../utils/notifications.js';

export class UserInteractions {

    constructor (store_actions) {
        this.store_actions = store_actions;

        this.build_counts = this.build_counts.bind(this);
        this.select_taxonomy = this.select_taxonomy.bind(this);
        this.release_annotations = this.release_annotations.bind(this);
    }

    build_counts (taxonomy_class, counts) {
        const taxonomy_class_id = taxonomy_class['id'];
        if (counts[taxonomy_class_id]) {
            taxonomy_class['counts'] = counts[taxonomy_class_id];
        }
        if (taxonomy_class['children'] && taxonomy_class['children'].length > 0) {
            taxonomy_class['children'].forEach(t => {
                this.store_actions.build_counts(t, counts);
            });
        }
    }

    async select_taxonomy (version, taxonomy_name) {
        this.store_actions.set_selected_taxonomy({
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
            this.store_actions.set_annotation_counts(counts);
            this.store_actions.set_taxonomy_class([taxonomy_classes]);
            this.store_actions.toggle_taxonomy_class_tree_element(version['root_taxonomy_class_id']);
        } catch (e) {
            notifier.error('We were unable to fetch the taxonomy classes.');
        }
    }

    async release_annotations (taxonomy_class_id) {
        await notifier.confirm('Do you really want to release all the annotations of the selected class, as well as its children?');
        try {
            await release_annotations_request(taxonomy_class_id);
            const counts = await flat_taxonomy_classes_counts(taxonomy_class_id);
            this.store_actions.set_annotation_counts(counts);
            notifier.ok('Annotations were released.');
        } catch (error) {
            notifier.error('We were unable to release the annotations.')
        }
    }

}
