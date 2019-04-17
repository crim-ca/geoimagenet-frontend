import {make_http_request, post_json, put_json} from '../utils/http.js';
import {WMSCapabilities} from 'ol/format';

/**
 * Here we find all the actual requests for data from the api.
 * @todo refactor http utilities as their class to inject them here.
 */
export class DataQueries {

    /**
     * @public
     * @param {String} geoimagenet_api_url
     * @param {String} magpie_endpoint
     */
    constructor(geoimagenet_api_url, magpie_endpoint) {
        /**
         * @private
         * @type {String}
         */
        this.geoimagenet_api_endpoint = geoimagenet_api_url;
        /**
         * @private
         * @type {String}
         */
        this.magpie_endpoint = magpie_endpoint;
    }

    logout_request() {
        return make_http_request(`${this.magpie_endpoint}/signout`);
    }

    login_request(form_data) {
        const payload = JSON.stringify(form_data);
        return post_json(`${this.magpie_endpoint}/signin`, payload);
    }


    /**
     * Launches the dataset creation task through the geoimagenet api, that will in turn call the machine learning api.
     * @param {String} dataset_name
     * @param {Number} taxonomy_id
     * @returns {Promise<*|*|undefined>}
     */
    launch_dataset_creation = (dataset_name, taxonomy_id) => {
        const payload = JSON.stringify({
            name: dataset_name,
            taxonomy_id: taxonomy_id,
        });
        return post_json(`${this.geoimagenet_api_endpoint}/batches`, payload);
    };

    /**
     * Returns information for the user associated with current cookies. We rely on the cookies being automatically associated
     * to requests here. This is fairly usual behaviour.
     * @returns {Promise<Object>}
     */
    current_user_session = async () => {
        const res = await make_http_request(`${this.magpie_endpoint}/users/current`);
        return res.json();
    };

    /**
     * Fetches the permissions for the logged user and specified service name. We hardcode the inherit=true parameter because so far
     * there is no case where we don't want all of the permissions.
     * @param {String} service_name
     * @returns {Promise<String>}
     */
    current_user_permissions = async (service_name) => {
        const res = await make_http_request(`${this.magpie_endpoint}/users/current/services/${service_name}/resources?inherit=true`);
        return res.json();
    };

    release_annotations_request = taxonomy_class_id => {
        const payload = JSON.stringify({
            taxonomy_class_id: taxonomy_class_id,
        });
        return post_json(`${this.geoimagenet_api_endpoint}/annotations/release`, payload);
    };

    /**
     * Call after validating with the user that they really want to release annotations. This will release all annotations
     * of all children of the taxnomy class, if any.
     * @param {Number[]} annotation_ids
     * @returns {Promise<*>}
     */
    validate_annotations_request = annotation_ids => {
        const payload = JSON.stringify({
            annotation_ids: annotation_ids,
        });
        return post_json(`${this.geoimagenet_api_endpoint}/annotations/validate`, payload);
    };

    reject_annotations_request = annotation_ids => {
        const payload = JSON.stringify({
            annotation_ids: annotation_ids,
        });
        return post_json(`${this.geoimagenet_api_endpoint}/annotations/reject`, payload);
    };

    delete_annotations_request = annotation_ids => {
        const payload = JSON.stringify({
            annotation_ids: annotation_ids
        });
        return post_json(`${this.geoimagenet_api_endpoint}/annotations/delete`, payload);
    };

    fetch_taxonomies = async () => {
        const res = await make_http_request(`${this.geoimagenet_api_endpoint}/taxonomy`);
        return res.json();
    };

    /**
     * Fetch the taxonomy classes in a nested data structure to represent the nested tree we can see in the UI.
     * @param {int} root_taxonomy_class_id
     * @returns {Promise<Object>}
     */
    fetch_taxonomy_classes = async root_taxonomy_class_id => {
        const res = await make_http_request(`${this.geoimagenet_api_endpoint}/taxonomy_classes/${root_taxonomy_class_id}`);
        return res.json();
    };

    flat_taxonomy_classes_counts = async root_taxonomy_class_id => {
        const res = await make_http_request(`${this.geoimagenet_api_endpoint}/annotations/counts/${root_taxonomy_class_id}`);
        return res.json();
    };

    create_geojson_feature = async payload => {
        const res = await post_json(`${this.geoimagenet_api_endpoint}/annotations`, payload);
        return res.json();
    };

    modify_geojson_features = async payload => {
        return put_json(`${this.geoimagenet_api_endpoint}/annotations`, payload);
    };

    geoserver_capabilities = async url => {
        let parser = new WMSCapabilities();
        const res = await make_http_request(url);
        const text = await res.text();
        return parser.read(text);
    };

}
