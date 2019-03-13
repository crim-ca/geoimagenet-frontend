import {make_http_request, post_json, put_json} from '../utils/http.js';
import {WMSCapabilities} from 'ol/format';

const reject = Promise.reject.bind(Promise);

/**
 * Here we find all the actual requests for data from the api.
 * @todo refactor http utilities as their class to inject them here.
 */
export class DataQueries {

    /**
     * @public
     * @param {String} geoimagenet_api_url
     */
    constructor(geoimagenet_api_url) {
        /**
         * @private
         * @type {String}
         */
        this.geoimagenet_api_url = geoimagenet_api_url;
    }

    release_annotations_request = async taxonomy_class_id => {
        const payload = JSON.stringify({
            taxonomy_class_id: taxonomy_class_id,
        });
        try {
            return await post_json(`${this.geoimagenet_api_url}/annotations/release`, payload);
        } catch (e) {
            return reject(e);
        }
    };

    /**
     * Call after validating with the user that they really want to release annotations. This will release all annotations
     * of all children of the taxnomy class, if any.
     * @param {Number[]} annotation_ids
     * @returns {Promise<*>}
     */
    validate_annotations_request = async annotation_ids => {
        const payload = JSON.stringify({
            annotation_ids: annotation_ids,
        });
        try {
            return await post_json(`${this.geoimagenet_api_url}/annotations/validate`, payload);
        } catch (e) {
            return reject(e);
        }
    };

    reject_annotations_request = async annotation_ids => {
        const payload = JSON.stringify({
            annotation_ids: annotation_ids,
        });
        try {
            return await post_json(`${this.geoimagenet_api_url}/annotations/reject`, payload);
        } catch (e) {
            return reject(e);
        }
    };

    delete_annotations_request = async annotation_ids => {
        const payload = JSON.stringify({
            annotation_ids: annotation_ids
        });
        try {
            return await post_json(`${this.geoimagenet_api_url}/annotations/delete`, payload);
        } catch (e) {
            return reject(e);
        }
    };

    fetch_taxonomies = async () => {
        try {
            const res = await make_http_request(`${this.geoimagenet_api_url}/taxonomy`);
            return await res.json();
        } catch (e) {
            return reject(e);
        }
    };

    /**
     * Fetch the taxonomy classes in a nested data structure to represent the nested tree we can see in the UI.
     * @param {int} root_taxonomy_class_id
     * @returns {Promise<Object>}
     */
    nested_taxonomy_classes = async root_taxonomy_class_id => {
        try {
            const res = await make_http_request(`${this.geoimagenet_api_url}/taxonomy_classes/${root_taxonomy_class_id}`);
            return await res.json();
        } catch (e) {
            return reject(e);
        }
    };

    flat_taxonomy_classes_counts = async root_taxonomy_class_id => {
        try {
            const res = await make_http_request(`${this.geoimagenet_api_url}/annotations/counts/${root_taxonomy_class_id}`);
            return await res.json();
        } catch (e) {
            return reject(e);
        }
    };

    create_geojson_feature = async payload => {
        try {
            const res = await post_json(`${this.geoimagenet_api_url}/annotations`, payload);
            return await res.json();
        } catch (e) {
            return reject(e);
        }
    };

    modify_geojson_features = async payload => {
        try {
            return await put_json(`${this.geoimagenet_api_url}/annotations`, payload);
        } catch (e) {
            return reject(e);
        }
    };

    geoserver_capabilities = async url => {
        try {
            let parser = new WMSCapabilities();
            const res = await make_http_request(url);
            const text = await res.text();
            return parser.read(text);
        } catch (e) {
            return reject(e);
        }
    };

}
