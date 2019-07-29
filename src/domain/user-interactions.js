import {DialogManager} from '../utils/Dialogs';
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
     * @param {object} i18next_instance
     */
    constructor(store_actions, data_queries, i18next_instance) {
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
        /**
         * @private
         * @type {object}
         */
        this.i18next_instance = i18next_instance;

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

    /**
     * When fetching taxonomies, we need to
     *  - actually fetch the taxonomies
     *  - fetch the taxonomy classes
     *  - build default values for each taxonomy class element (such as the checked, for visibility selection, or opened, for tree navigation)
     *  - build the localized versions strings in the i18n framework (ideally only if theye not already present)
     *
     * @returns {Promise<void>}
     */
    @action.bound
    async fetch_taxonomies() {
        try {
            const taxonomies = await this.data_queries.fetch_taxonomies();
            this.store_actions.set_taxonomy(taxonomies);
            const root_taxonomy_classes = await this.data_queries.fetch_taxonomy_classes(1);
            /**
             * the build_taxonomy_classes_structure has the nice side-effect of building a flat taxonomy classes structure as well!
             * so we will neatly ask it to generate language dictionaries for newly added taxonomy classes afterwards
             */
            root_taxonomy_classes.forEach(root_taxonomy_class => this.store_actions.build_taxonomy_classes_structures(root_taxonomy_class));

            const fr_dict = this.store_actions.generate_localized_taxonomy_classes_labels('fr');
            const en_dict = this.store_actions.generate_localized_taxonomy_classes_labels('en');

            this.i18next_instance.addResources('fr', 'taxonomy_classes', fr_dict);
            this.i18next_instance.addResources('en', 'taxonomy_classes', en_dict);

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
    }

    /**
     *
     * When the user selects a taxonomy, we decide to refresh the annotation counts, as they can change more often than the classes themselves.
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
            const counts = await this.data_queries.flat_taxonomy_classes_counts(version['root_taxonomy_class_id']);
            this.store_actions.set_annotation_counts(counts);
            this.store_actions.toggle_taxonomy_class_tree_element(version['root_taxonomy_class_id'], true);
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
        await DialogManager.confirm('Do you really want to release all the annotations of the selected class, as well as its children?');
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
