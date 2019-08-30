// @flow strict

import {DialogManager} from '../components/Dialogs';
import {action} from 'mobx';
import {InvalidPermissions, ProbablyInvalidPermissions, ResourcePermissionRepository, User} from './entities.js';
import {AccessControlList} from './access-control-list.js';
import {NotificationManager} from 'react-notifications';

import {ANNOTATION} from "./constants";
import {captureException} from "@sentry/browser";
import {DataQueries} from "./data-queries";

import {typeof Map} from "ol/Map";
import {typeof Event} from "ol/events";
import {typeof GeoJSON} from "ol/format";
import {StoreActions} from "../store/StoreActions";
import {GeoImageNetStore} from "../store/GeoImageNetStore";
import {typeof Feature, ModifyEvent} from "ol";
import {SatelliteImage, Taxonomy, TaxonomyClass} from "./entities";
import type {FollowedUser, MagpieMergedSessionInformation, TaxonomyClassesDataFromAPI} from "../Types";
import {i18n} from '../utils';

const {t} = i18n;


/**
 * In a web app, we need top level handlers that react to specific user intentions, and interactions.
 * These are not event handlers per se, they should receive everything needed to execute everything intended by the user,
 * from confirmation to store alterations.
 */
type Coordinate = [number, number];
type Coordinates = Coordinate[];
type CoordinatesSet = Coordinates[];

export class UserInteractions {

    store_actions: StoreActions;
    data_queries: DataQueries;
    i18next_instance: i18n;
    state_proxy: GeoImageNetStore;
    /**
     * @TODO move the original coordinates in the store, possibly a store specific to open layers
     */
    original_coordinates: {} = {};

    /**
     *
     * The user interactions have first-hand influence upon the application state,
     * we need the store actions as dependency
     */
    constructor(store_actions: StoreActions, data_queries: DataQueries, i18next_instance: i18n, state_proxy: GeoImageNetStore) {
        this.store_actions = store_actions;
        this.data_queries = data_queries;
        this.i18next_instance = i18next_instance;
        this.state_proxy = state_proxy;

        this.release_annotations = this.release_annotations.bind(this);
    }

    /**
     * Some actions need to redraw the annotations on the viewport. This method clears then refreshes the features on the specified layer.
     */
    refresh_source_by_status = (status: string) => {
        this.state_proxy.annotations_sources[status].clear();
        this.state_proxy.annotations_sources[status].refresh(true);
    };

    refresh_all_sources = () => {
        const {annotation_status_list} = this.state_proxy;
        Object.keys(this.state_proxy.annotation_status_list).forEach(k => {
            const annotation_status = annotation_status_list[k];
            if (annotation_status.activated) {
                this.refresh_source_by_status(annotation_status.text);
            }
        });
    };

    switch_features_from_source_to_source(features: Array<Feature>, old_source: string, new_source: string) {
        /**
         * while it would seem tempting to move the features all at once and change the count with the features.length,
         * the taxonomy class id changes for each feature, so we need to loop over the collection to know it anyway
         * we could aggregate the counts then call the changes after the loop, maybe reducing the function calls,
         * but there's no guarantee that the collection is not of all different classes, nor that it'd be any faster
         */
        features.forEach(feature => {
            const taxonomy_class_id = feature.get('taxonomy_class_id');
            this.state_proxy.annotations_sources[old_source].removeFeature(feature);
            this.state_proxy.annotations_sources[new_source].addFeature(feature);
            this.store_actions.change_annotation_status_count(taxonomy_class_id, old_source, -1);
            this.store_actions.change_annotation_status_count(taxonomy_class_id, new_source, 1);
        });
    }

    delete_annotation_under_click = async (features: Array<Feature>, feature_ids: Array<number>) => {
        try {
            await DialogManager.confirm(`Do you really want to delete the highlighted feature?`);
        } catch (e) {
            // if we catched it means user did not want to delete the annotation, simply return, nothing problematic here.
            return;
        }
        try {
            await this.data_queries.delete_annotations_request(feature_ids);
            this.switch_features_from_source_to_source(features, ANNOTATION.STATUS.NEW, ANNOTATION.STATUS.DELETED);
        } catch (error) {
            const json = await error.json();
            NotificationManager.error(json.detail);
            captureException(error);
        }
    };

    validate_features_under_click = async (features: Array<Feature>, feature_ids: Array<number>) => {
        try {
            await this.data_queries.validate_annotations_request(feature_ids);
            this.switch_features_from_source_to_source(features, ANNOTATION.STATUS.RELEASED, ANNOTATION.STATUS.VALIDATED);
        } catch (error) {
            const json = await error.json();
            NotificationManager.error(json.detail);
            captureException(error);
        }
    };

    reject_features_under_click = async (features: Array<Feature>, feature_ids: Array<number>) => {
        try {
            await this.data_queries.reject_annotations_request(feature_ids);
            this.switch_features_from_source_to_source(features, ANNOTATION.STATUS.RELEASED, ANNOTATION.STATUS.REJECTED);
        } catch (error) {
            const json = await error.json();
            NotificationManager.error(json.detail);
            captureException(error);
        }
    };

    validate_creation_event_has_features = async () => {
        if (this.state_proxy.selected_taxonomy_class_id === -1) {
            NotificationManager.warning('You must select a taxonomy class to begin annotating content.');
        }
    };

    /**
     * Launch the creation of a new annotation. This should also update the "new" annotations count of the relevant
     * taxonomy class.
     */
    create_drawend_handler = (format_geojson: GeoJSON, annotation_layer: string, annotation_namespace: string) => async (event: Event) => {
        const {feature}: { feature: Feature } = event;
        const {selected_taxonomy_class_id} = this.state_proxy;
        feature.setProperties({
            taxonomy_class_id: selected_taxonomy_class_id,
            image_name: this.state_proxy.current_annotation.image_title,
        });
        const payload = format_geojson.writeFeature(feature);
        try {
            const [new_feature_id] = await this.data_queries.create_geojson_feature(payload);
            feature.setId(`${annotation_layer}.${new_feature_id}`);
            const typename = `${annotation_namespace}:${annotation_layer}`;
            const feature_from_distant_api = await this.data_queries.get_annotation_by_id(new_feature_id, typename);
            feature.set('name', feature_from_distant_api.properties.name);
            this.store_actions.change_annotation_status_count(this.state_proxy.selected_taxonomy_class_id, ANNOTATION.STATUS.NEW, 1);
            this.store_actions.invert_taxonomy_class_visibility(this.state_proxy.flat_taxonomy_classes[selected_taxonomy_class_id], true);
        } catch (error) {
            NotificationManager.error(error.message);
        }
        this.store_actions.end_annotation();
    };

    save_followed_user = (form_data: { id: number | string, nickname: string }[]): void => {
        this.data_queries.save_followed_user(form_data).then(
            () => {
                NotificationManager.success(t('settings.save_followed_users_success'));
            },
            error => {
                captureException(error);
                NotificationManager.error(t('settings.save_followed_users_failure'));
            },
        );
    };

    get_followed_users_collection = (): Promise<FollowedUser[]> => {
        return new Promise((resolve, reject) => {
            this.data_queries.fetch_followed_users().then(
                response => resolve(response),
                error => {
                    captureException(error);
                    NotificationManager.error(t('settings.fetch_followed_users_failure'));
                    reject(error);
                },
            );
        });
    };

    remove_followed_user = async (id: number): Promise<void> => {
        try {
            await this.data_queries.remove_followed_user(id);
            NotificationManager.success(t('settings:remove_followed_user_success'));
        } catch (e) {
            captureException(e);
            throw(e);
        }
    };

    populate_image_dictionary = async () => {
        const images_dictionary = await this.data_queries.fetch_images_dictionary();
        this.store_actions.set_images_dictionary(images_dictionary);
    };

    /**
     * here we validate that a feature is completely over the same image
     * for every point in the geometry
     *   for every layer under the point
     *     reject the modification if the layer does not correspond to either image name of the image id
     */
    feature_respects_its_original_image = (feature: Feature, map: Map) => {
        const image_id = feature.get('image_id');
        const this_satellite_image: SatelliteImage | typeof undefined = this.state_proxy.images_dictionary.find(image => {
            return image.id === image_id;
        });
        if (this_satellite_image === undefined) {
            NotificationManager.error('The image you are trying to annotate does not seem to be referenced by the aip. ' +
                'You may try to reload the platform but this seem to be an internal error, you may want to contact ' +
                'your platform administrator.');
            return false;
        }
        const correct_image_layer = this_satellite_image.layer_name;
        const coordinates_set: CoordinatesSet = feature.getGeometry().getCoordinates();
        let passes_validation: boolean = true;
        coordinates_set.forEach((coordinates: Coordinates) => {
            coordinates.forEach(coordinate => {
                const pixel = map.getPixelFromCoordinate(coordinate);
                const layer_titles_under_this_pixel = [];
                map.forEachLayerAtPixel(pixel, layer => {
                    if (layer.type === 'TILE') {
                        const title = layer.get('title');
                        layer_titles_under_this_pixel.push(title);
                    }
                });
                if (!layer_titles_under_this_pixel.some(title => title === correct_image_layer)) {
                    passes_validation = false;
                }
            });
        });
        return passes_validation;
    };

    modifystart_handler = (event: Event) => {
        event.features.forEach(feature => {
            this.original_coordinates[feature.getId()] = feature.getGeometry().getCoordinates();
        });
    };

    /**
     * Create an event handler that OL will call when a modification is done
     *
     * the handler, when called, should verify that the geometry is over the same image as it was before.
     */
    create_modifyend_handler = (format_geojson: GeoJSON, map: Map) => async (event: ModifyEvent) => {
        const modified_features = [];
        event.features.forEach((feature) => {
            if (feature.revision_ >= 1) {
                modified_features.push(feature);
                feature.revision_ = 0;
            }
        });

        modified_features.forEach((feature: Feature, index: number) => {
            if (!this.feature_respects_its_original_image(feature, map)) {
                // feature is not ok, reset it and remove it from the modified features
                feature.getGeometry().setCoordinates(this.original_coordinates[feature.getId()]);
                modified_features.splice(index, 1);
                NotificationManager.warning('An annotation must be wholly contained in a single image, ' +
                    'you are trying to make a coordinate go outside of the original image.');
            }

        });

        if (modified_features.length > 0) {
            const payload = format_geojson.writeFeatures(modified_features);
            try {
                await this.data_queries.modify_geojson_features(payload);
            } catch (error) {
                NotificationManager.error(error.message);
            }
        }
    };

    ask_expertise_for_features = async (feature_ids: number[], features: Feature[]) => {
        try {
            await this.data_queries.review_request(feature_ids, true);
            features.forEach(feature => {
                feature.set('review_requested', true);
            });
            NotificationManager.success('Features were marked for expertise.');
        } catch (error) {
            captureException(error);
            NotificationManager.error(error.message);
        }
    };

    start_annotation(image_title: string) {
        this.store_actions.set_current_annotation_image_title(image_title);
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
            const root_taxonomy_classes: TaxonomyClassesDataFromAPI = await this.data_queries.fetch_taxonomy_classes();
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
     * When the user selects a taxonomy, we decide to refresh the annotation counts, as they can change more often than the classes themselves.
     */
    @action.bound
    async select_taxonomy(taxonomy: Taxonomy) {
        this.store_actions.set_selected_taxonomy(taxonomy);
        try {
            const counts = await this.data_queries.flat_taxonomy_classes_counts(this.state_proxy.root_taxonomy_class_id);
            this.store_actions.set_annotation_counts(counts);
            this.store_actions.toggle_taxonomy_class_tree_element(this.state_proxy.root_taxonomy_class_id, true);
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
        const magpie_session_json: MagpieMergedSessionInformation = await this.data_queries.current_user_session();
        const {user, authenticated} = magpie_session_json;
        const user_instance = new User(user.user_name, user.email, user.group_names, user.user_id);
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
     */
    release_annotations = async (taxonomy_class_id: number) => {
        await DialogManager.confirm('Do you really want to release all the annotations of the selected class, as well as its children?');
        try {
            await this.data_queries.release_annotations_request(taxonomy_class_id);
            const counts = await this.data_queries.flat_taxonomy_classes_counts(taxonomy_class_id);
            this.store_actions.set_annotation_counts(counts);
            NotificationManager.success('Annotations were released.');
        } catch (error) {
            captureException(error);
            NotificationManager.error('We were unable to release the annotations.');
        }
    };

    /**
     * Toggles the visibility of a taxonomy class's children in the taxonomy browser
     * @param {TaxonomyClass} taxonomy_class
     */
    @action.bound
    toggle_taxonomy_class(taxonomy_class: TaxonomyClass) {
        const taxonomy_class_id = taxonomy_class.id;
        this.store_actions.toggle_taxonomy_class_tree_element(taxonomy_class_id);
    }

    /**
     * When submitting the login form, the user expects to login, or be presented with error about said login.
     * Send the credentials to magpie, then verify content to be sure user is logged in, then notify about sucessful login.
     * In case of error, notify of problem without leaking too much detail.
     */
    async login_form_submission(form_data: {}) {
        try {
            await this.data_queries.login_request(form_data);
            window.location.href = '/platform';
        } catch (error) {
            NotificationManager.error(this.i18next_instance.t('login:forbidden'));
        }
    }

}
