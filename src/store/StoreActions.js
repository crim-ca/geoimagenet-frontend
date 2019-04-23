import {TaxonomyClass} from '../domain/entities.js';
import {ANNOTATION, MODE} from '../domain/constants.js';
import {observable, action, runInAction} from 'mobx';

/**
 * The store actions are lower level action handlers, in the sense that they are not directly related to a user's actions,
 * but rather are used strictly to update the state of the application, upon which the ui will depend.
 */

export class StoreActions {

    /**
     * We use MobX as our state manager, hence our store is the primary dependency of our store actions.
     * @param {GeoImageNetStore} state_proxy
     */
    constructor(state_proxy) {
        /**
         * @type {GeoImageNetStore}
         */
        this.state_proxy = state_proxy;
    }

    @action.bound
    toggle_show_labels() {
        this.state_proxy.show_labels = !this.state_proxy.show_labels;
    }

    /**
     *
     * @param {Dataset} dataset
     */
    @action.bound
    select_dataset(dataset) {
        if (this.state_proxy.datasets.selected_dataset === dataset) {
            this.state_proxy.datasets.selected_dataset = null;
        } else {
            this.state_proxy.datasets.selected_dataset = dataset;
        }
    }

    /**
     * When user adds an annotation status to the visibility pool, we need to update the store.
     * @param {String} annotation_status_text
     */
    @action.bound
    toggle_annotation_status_visibility(annotation_status_text) {
        const annotation_status_instance = this.state_proxy.annotation_status_list[annotation_status_text];
        annotation_status_instance.activated = !annotation_status_instance.activated;
        this.set_annotation_layer_visibility(annotation_status_text, annotation_status_instance.activated);
    }

    /**
     * The annotation actions can only be done under a specific zoom level. This should be called when we are passed that threshold.
     */
    @action.bound
    activate_actions() {
        this.state_proxy.actions_activated = true;
    }

    /**
     * This should be called when we change resolution in a way that prohibits relevant annotations to be created.
     */
    @action.bound
    deactivate_actions() {
        this.state_proxy.actions_activated = false;
    }

    /**
     * @param {User} user
     */
    @action.bound
    set_session_user(user) {
        this.state_proxy.logged_user = user;
    }

    /**
     * Invert the opened property for specific taxonomy class id
     * @param {int} taxonomy_class_id
     */
    @action.bound
    toggle_taxonomy_class_tree_element(taxonomy_class_id) {
        /** @type {TaxonomyClass} taxonomy_class */
        const taxonomy_class = this.state_proxy.flat_taxonomy_classes[taxonomy_class_id];
        taxonomy_class.opened = !taxonomy_class.opened;
    }

    /**
     * Take the raw data structure from the api and transform it into usable structures for the UI.
     *
     * loop over an object, build a class instance from it.
     * assign the class instance to its index in the flat taxonomy list
     * if we have a parent id, add the instance to the children of said parent id in the flat list
     * iw we have children, recursive call to this function for each children
     *
     * @param {object} nested_taxonomy_classes_from_api
     */
    @action.bound
    build_taxonomy_classes_structures(nested_taxonomy_classes_from_api) {

        const assign_top_object_to_list = (object, parent_id = null) => {
            const current_raw = object;

            /**
             * Not quite completely sure why and how the observable.object is needed here.
             * I think it's because mobx does not observe too deeply nested object's properties.
             * @type {TaxonomyClass & IObservableObject}
             */
            const current_instance = observable.object(new TaxonomyClass(
                current_raw.id,
                current_raw.name_fr,
                current_raw.name_en,
                current_raw.taxonomy_id
            ));
            this.state_proxy.flat_taxonomy_classes[current_instance.id] = current_instance;

            if (parent_id !== null) {
                current_instance.parent_id = parent_id;
                this.state_proxy.flat_taxonomy_classes[parent_id].children.push(current_instance);
            }

            if (current_raw.children && current_raw.children.length > 0) {
                current_raw.children.forEach(c => {
                    assign_top_object_to_list(c, current_raw.id);
                });
            }
        };

        assign_top_object_to_list(nested_taxonomy_classes_from_api);

    }

    /**
     * Call when it's certain the the annotation was added, this only updates the local storage for displaying purposes.
     * Counts not being computed automaticaly from children counts (nothing really to gain there for now)
     * we also need to update the parent's new annotations count if any.
     * @public
     * @param {Number} taxonomy_class_id
     */
    @action.bound
    increment_new_annotations_count(taxonomy_class_id) {

        let instance = this.state_proxy.flat_taxonomy_classes[taxonomy_class_id];
        let counts = instance['counts'];

        /**
         * Technically this could be initialized, but in the case it's not, put a 1 in there.
         * @type {*|number}
         */
        counts[ANNOTATION.STATUS.NEW] = (counts[ANNOTATION.STATUS.NEW] + 1) || 1;

        while (instance.parent_id !== null) {
            instance = this.state_proxy.flat_taxonomy_classes[instance.parent_id];
            counts = instance['counts'];
            counts[ANNOTATION.STATUS.NEW] = (counts[ANNOTATION.STATUS.NEW] + 1) || 1;
        }

    }

    @action.bound
    start_annotation(image_title) {
        this.state_proxy.current_annotation.initialized = true;
        this.state_proxy.current_annotation.image_title = image_title;
    }

    @action.bound
    end_annotation() {
        this.state_proxy.current_annotation.initialized = false;
        this.state_proxy.current_annotation.image_title = '';
    }

    /**
     *
     * @param {Object} counts
     */
    @action.bound
    set_annotation_counts(counts) {
        for (let class_id in counts) {
            this.state_proxy.flat_taxonomy_classes[class_id].counts = counts[class_id];
        }
    }

    @action.bound
    set_annotation_collection(key, collection) {
        this.state_proxy.annotations_collections[key] = collection;
    }

    @action.bound
    set_annotation_source(key, source) {
        this.state_proxy.annotations_sources[key] = source;
    }

    /**
     *
     * @param {String} key
     * @param {VectorLayer} layer
     */
    @action.bound
    set_annotation_layer(key, layer) {
        this.state_proxy.annotations_layers[key] = layer;
    }

    /**
     * we have the annotation layers stored. When changing the visibility of a layer somehow, we should call this to set
     * the appropriate visibility on the layer.
     * @param {String} key
     * @param {Boolean} visible
     */
    @action.bound
    set_annotation_layer_visibility(key, visible) {
        this.state_proxy.annotations_layers[key].setVisible(visible);
    }

    @action.bound
    set_taxonomy(t) {
        this.state_proxy.taxonomies = t;
    }

    @action.bound
    set_selected_taxonomy(t) {
        this.state_proxy.selected_taxonomy = t;
    }

    /**
     * Inverts a taxonomy class annotations visibility on the viewport, as well as all this class's children's visibility.
     * Note that filters still apply on what annotations statuses are shown.
     * @param {object} t
     * @param {boolean|null} visible if null, assumes that we want to invert the visible property of the class,
     *                       otherwise sets visibility to visible value passed to the function
     */
    @action.bound
    invert_taxonomy_class_visibility(t, visible = null) {
        runInAction(() => {
            if (visible !== null) {
                t.visible = visible;
            } else {
                t.visible = !t.visible;
            }
            if (t.children && t.children.length > 0) {
                t.children.forEach(c => {
                    this.invert_taxonomy_class_visibility(c, t.visible);
                });
            }
        });


        const visible_ids = [];
        const aggregate_selected_ids = (taxonomy_class) => {
            if (taxonomy_class.visible === true) {
                visible_ids.push(taxonomy_class.id);
            }
            if (taxonomy_class.children && taxonomy_class.children.length > 0) {
                aggregate_selected_ids(taxonomy_class.children);
            }
        };

        this.state_proxy.selected_taxonomy.elements.forEach(c => {
            aggregate_selected_ids(c);
        });
        this.set_visible_classes(visible_ids);

    }

    /**
     * @param {AccessControlList} acl
     */
    @action.bound
    set_acl(acl) {
        this.state_proxy.acl = acl;
    }

    /**
     * @todo maybe directly watch on the visible attribute of the nested classes
     * The cql filter runs on watching an array of ids, updating visible annotations when it changes.
     * This should be called with the new array of visible ids whenever it changes.
     * Liable to human error.
     * @param {int[]} classes
     */
    @action.bound
    set_visible_classes(classes) {
        this.state_proxy.visible_classes = classes;
    }

    /**
     * When clicking on taxonomy classes leafs (and leafs only) we want to give the ability to the user of creating annotations.
     * This will cascade the ability to the ui of creating annotations.
     * @param {int} id
     */
    @action.bound
    select_taxonomy_class(id) {
        this.state_proxy.selected_taxonomy_class_id = id;
    }

    /**
     * Simply sets the current platform mode. Observed by other parts of the application.
     * @param {String} mode
     */
    @action.bound
    set_mode(mode) {
        if (Object.values(MODE).indexOf(mode) > -1) {
            this.state_proxy.mode = mode;
        } else {
            throw Error(`The mode ${mode} is not a valid mode within this application`);
        }
    }

}
