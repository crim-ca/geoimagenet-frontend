import {make_http_request, post_json, put_json} from '../utils/http.js';
import {WMSCapabilities} from 'ol/format';

const reject = Promise.reject.bind(Promise);

export const release_annotations_request = async taxonomy_class_id => {
    const payload = JSON.stringify({
        taxonomy_class_id: taxonomy_class_id,
    });
    try {
        return await post_json(`${GEOIMAGENET_API_URL}/annotations/release`, payload);
    } catch (e) {
        return reject(e);
    }
};

export const validate_annotations_request = async annotation_ids => {
    const payload = JSON.stringify({
        annotation_ids: annotation_ids,
    });
    try {
        return await post_json(`${GEOIMAGENET_API_URL}/annotations/validate`, payload);
    } catch (e) {
        return reject(e);
    }
};

export const reject_annotations_request = async annotation_ids => {
    const payload = JSON.stringify({
        annotation_ids: annotation_ids,
    });
    try {
        return await post_json(`${GEOIMAGENET_API_URL}/annotations/reject`, payload);
    } catch (e) {
        return reject(e);
    }
};

export const delete_annotations_request = async annotation_ids => {
    const payload = JSON.stringify({
        annotation_ids: annotation_ids
    });
    try {
        return await post_json(`${GEOIMAGENET_API_URL}/annotations/delete`, payload);
    } catch (e) {
        return reject(e);
    }
};

export const fetch_taxonomies = async () => {
    try {
        const res = await make_http_request(`${GEOIMAGENET_API_URL}/taxonomy`);
        return await res.json();
    } catch (e) {
        return reject(e);
    }
};

export const nested_taxonomy_classes = async root_taxonomy_class_id => {
    try {
        const res = await make_http_request(`${GEOIMAGENET_API_URL}/taxonomy_classes/${root_taxonomy_class_id}`);
        return await res.json();
    } catch (e) {
        return reject(e);
    }
};

export const flat_taxonomy_classes_counts = async root_taxonomy_class_id => {
    try {
        const res = await make_http_request(`${GEOIMAGENET_API_URL}/annotations/counts/${root_taxonomy_class_id}`);
        return await res.json();
    } catch (e) {
        return reject(e);
    }
};

export const create_geojson_feature = async payload => {
    try {
        const res = await post_json(`${GEOIMAGENET_API_URL}/annotations`, payload);
        return await res.json();
    } catch (e) {
        return reject(e);
    }
};

export const modify_geojson_features = async payload => {
    try {
        return await put_json(`${GEOIMAGENET_API_URL}/annotations`, payload);
    } catch (e) {
        return reject(e);
    }
};

export const geoserver_capabilities = async url => {
    try {
        let parser = new WMSCapabilities();
        const res = await make_http_request(url);
        const text = await res.text();
        return parser.read(text);
    } catch (e) {
        return reject(e);
    }
};
