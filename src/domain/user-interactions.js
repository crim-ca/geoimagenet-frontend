import {notifier} from '../utils/notifications.js';
import {action} from 'mobx';
import {InvalidPermissions, ProbablyInvalidPermissions, ResourcePermissionRepository, User} from './entities.js';
import {AccessControlList} from './access-control-list.js';
import {NotificationManager} from 'react-notifications';

import {i18n} from '../utils/i18n';

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

    logout = async () => {
        try {
            await this.data_queries.logout_request();
            window.location = '/';
        } catch (e) {
            return Promise.reject(e);
        }
    };

    fetch_taxonomies = async () => {
        try {
            const taxonomies = await this.data_queries.fetch_taxonomies();
            this.store_actions.set_taxonomy(taxonomies);
        } catch (e) {
            switch (e.status) {
                case 404:
                    NotificationManager.warning('There doesn\'t seem to be any taxonomy available in the API (we received a 404 not-found status). ' +
                        'This will likely render the platform unusable until someone populates the taxonomies.');
                    break;
                default:
                    NotificationManager.error('We could not fetch the taxonomies. This will heavily and negatively impact the platform use.');
            }
        }
    };

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

            const root_taxonomy_class = await this.data_queries.fetch_taxonomy_classes(version['root_taxonomy_class_id']);
            const counts = await this.data_queries.flat_taxonomy_classes_counts(version['root_taxonomy_class_id']);

            this.store_actions.build_taxonomy_classes_structures(root_taxonomy_class);
            this.store_actions.set_annotation_counts(counts);

            this.store_actions.toggle_taxonomy_class_tree_element(version['root_taxonomy_class_id']);
        } catch (e) {
            NotificationManager.error('We were unable to fetch the taxonomy classes.');
        }
    }

    /**
     * Should be called anytime there is a change to the user's session, either login or logout.
     * @todo at some point unhardcode the frontend parameter here, maybe get it from environment variable
     * @returns {Promise<void>}
     */
    refresh_user_resources_permissions = async () => {
        /**
         *
         * @type {Object}
         */
        const magpie_session_json = await this.data_queries.current_user_session();
        const {user, authenticated} = magpie_session_json;
        const user_instance = new User(user.user_name, user.email, user.group_names);
        this.store_actions.set_session_user(user_instance);
        let json_response;
        try {
            json_response = await this.data_queries.current_user_permissions('frontend');
        } catch (e) {
            if (e.status === 404) {
                NotificationManager.error('Permissions for the frontend service do not seem to be properly configured. ' +
                    'That will probably prevent you from using the platform, please contact your administrator.');
                return;
            }
            throw e;
        }

        if (!json_response.service && !json_response.service.resources) {
            NotificationManager.error('The permissions structure returned from Magpie does not seem properly formed: ' +
                'there is no resource attribute on it.');
            throw new InvalidPermissions();
        }
        const {service} = json_response;
        const {resources} = service;
        let resource_permission_repository;
        try {
            resource_permission_repository = new ResourcePermissionRepository(resources);
        } catch (e) {
            if (e instanceof ProbablyInvalidPermissions) {
                NotificationManager.warning('It seems that permissions for your user are either incorrectly set, ' +
                    'or undefined. This is probably not something you can solve on your own, please contact ' +
                    'your administrator if this prevents you from using the platform.');
                return;
            }
            throw e;
        }
        const acl = new AccessControlList(resource_permission_repository, authenticated);
        this.store_actions.set_acl(acl);

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
            NotificationManager.success('Annotations were released.');
        } catch (error) {
            NotificationManager.error('We were unable to release the annotations.');
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
            NotificationManager.error(i18n.t('login:forbidden'));
        }
    }

}
