import {notifier} from '../utils/notifications.js';
import {action} from 'mobx';
import {InvalidPermissions, ResourcePermissionRepository, User} from './entities.js';
import {AccessControlList} from './access-control-list.js';

/**
 * In a web app, we need top level handlers that react to specific user intentions, and interactions.
 * These are not event handlers per se, they should receive everything needed to execute everything intended by the user,
 * from confirmation to store alterations.
 */

export class UserInteractions {

    /**
     *
     * The user interactions have first-hand influence upon the application state,
     * we need the store actions as dependency
     *
     * @param {StoreActions} store_actions
     * @param {DataQueries} data_queries
     */
    constructor(store_actions, data_queries) {
        /**
         * @private
         * @type {StoreActions}
         */
        this.store_actions = store_actions;
        /**
         * @private
         * @type {DataQueries}
         */
        this.data_queries = data_queries;

        this.select_taxonomy = this.select_taxonomy.bind(this);
        this.release_annotations = this.release_annotations.bind(this);
    }


    /**
     *
     * When the user selects a taxonomy, we need to
     *  - fetch the taxonomy
     *  - build default values for each taxonomy class element (such as the checked, for visibility selection, or opened, for tree navigation)
     *  - by default, we toggle the first level of the tree, so that user down not have to do it
     *  - toggle visibility for every class in the taxonomy
     *
     * @param {object} version
     * @param {string} taxonomy_name
     * @returns {Promise<void>}
     */
    @action.bound
    async select_taxonomy(version, taxonomy_name) {
        this.store_actions.set_selected_taxonomy({
            id: version['taxonomy_id'],
            name: taxonomy_name,
            version: version['version'],
            root_taxonomy_class_id: version['root_taxonomy_class_id'],
            elements: [],
        });
        try {
            // TODO eventually make both requests under a Promise.all as they are not co-dependant

            const taxonomy_classes = await this.data_queries.fetch_taxonomy_classes(version['root_taxonomy_class_id']);
            // first create a flat list of all classes, removing the children

            this.store_actions.build_taxonomy_classes_structures(taxonomy_classes);

            const counts = await this.data_queries.flat_taxonomy_classes_counts(version['root_taxonomy_class_id']);
            this.store_actions.set_annotation_counts(counts);
            this.store_actions.set_taxonomy_class([taxonomy_classes]);
            this.store_actions.toggle_taxonomy_class_tree_element(version['root_taxonomy_class_id']);
        } catch (e) {
            notifier.error('We were unable to fetch the taxonomy classes.');
        }
    }

    /**
     * Should be called anytime there is a change to the user's session, either login or logout.
     * @todo at some point unhardcode the frontend parameter here, maybe get it from environment variable
     * @returns {Promise<void>}
     */
    refresh_user_resources_permissions = async () => {
        const json_response = await this.data_queries.current_user_permissions('frontend');

        if (!json_response.service && !json_response.service.resources) {
            notifier.error('The permissions structure returned from Magpie does not seem properly formed: ' +
                'there is no resource attribute on it.');
            throw new InvalidPermissions();
        }
        const {service} = json_response;
        const {resources} = service;
        const resource_permission_repository = new ResourcePermissionRepository(resources);
        const acl = new AccessControlList(resource_permission_repository);
        this.store_actions.set_acl(acl);

        /**
         *
         * @type {Object}
         */
        const magpie_session_json = await this.data_queries.current_user_session();
        const {user} = magpie_session_json;
        const user_instance = new User(user.user_name, user.email, user.group_names);
        this.store_actions.set_session_user(user_instance);

    };

    /**
     * - Release annotations for the selected class
     * - Update counts for relevant annotations
     * - Update features in relevant layers
     * @param {Number} taxonomy_class_id
     * @returns {Promise<void>}
     */
    async release_annotations(taxonomy_class_id) {
        await notifier.confirm('Do you really want to release all the annotations of the selected class, as well as its children?');
        try {
            await this.data_queries.release_annotations_request(taxonomy_class_id);
            const counts = await this.data_queries.flat_taxonomy_classes_counts(taxonomy_class_id);
            this.store_actions.set_annotation_counts(counts);
            notifier.ok('Annotations were released.');
        } catch (error) {
            notifier.error('We were unable to release the annotations.');
        }
    }

    /**
     * Toggles the visibility of a taxonomy class's children in the taxonomy browser
     * @param {TaxonomyClass} taxonomy_class
     */
    @action.bound
    toggle_taxonomy_class(taxonomy_class) {
        const taxonomy_class_id = taxonomy_class.id;
        this.store_actions.toggle_taxonomy_class_tree_element(taxonomy_class_id);
    }

    /**
     * When submitting the login form, the user expects to login, or be presented with error about said login.
     * Send the credentials to magpie, then verify content to be sure user is logged in, then notify about sucessful login.
     * In case of error, notify of problem without leaking too much detail.
     * @param {Object} form_data
     * @returns {Promise<void>}
     */
    async login_form_submission(form_data) {
        try {
            await this.data_queries.login_request(form_data);
            window.location.href = '/platform';
        } catch (error) {
            notifier.error('Login forbidden.');
        }
    }

}
