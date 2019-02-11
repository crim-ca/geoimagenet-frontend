import {make_http_request, post_json} from '../utils/http.js';

export const release_annotations_request = async taxonomy_class_id => {
    const payload = JSON.stringify({
        taxonomy_class_id: taxonomy_class_id,
    });
    try {
        return await post_json(`${GEOIMAGENET_API_URL}/annotations/release`, payload);
    } catch (e) {
        return Promise.reject(e);
    }
};

export const validate_annotations_request = async annotation_ids => {
    const payload = JSON.stringify({
        annotation_ids: annotation_ids,
    });
    try {
        return await post_json(`${GEOIMAGENET_API_URL}/annotations/validate`, payload);
    } catch (e) {
        return Promise.reject(e);
    }
};

export const reject_annotations_request = async annotation_ids => {
    const payload = JSON.stringify({
        annotation_ids: annotation_ids,
    });
    try {
        return await post_json(`${GEOIMAGENET_API_URL}/annotations/reject`, payload);
    } catch (e) {
        return Promise.reject(e);
    }
};

export const delete_annotations_request = async annotation_ids => {
    const payload = JSON.stringify({
        annotation_ids: annotation_ids
    });
    try {
        return await post_json(`${GEOIMAGENET_API_URL}/annotations/delete`, payload);
    } catch (e) {
        return Promise.reject(e);
    }
};

export const fetch_taxonomies = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await make_http_request(`${GEOIMAGENET_API_URL}/taxonomy`);
            const json = await res.json();
            resolve(json);
        } catch (e) {
            reject(e);
        }
    });
};

export const nested_taxonomy_classes = root_taxonomy_class_id => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await make_http_request(`${GEOIMAGENET_API_URL}/taxonomy_classes/${root_taxonomy_class_id}`);
            const json = await res.json();
            resolve(json);
        } catch (e) {
            reject(e);
        }
    });
};

export const flat_taxonomy_classes_counts = root_taxonomy_class_id => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await make_http_request(`${GEOIMAGENET_API_URL}/annotations/counts/${root_taxonomy_class_id}`);
            const json = await res.json();
            resolve(json);
        } catch (e) {
            reject(e);
        }
    });
};

export const create_geojson_feature = payload => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await make_http_request(`${GEOIMAGENET_API_URL}/annotations`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: payload,
            });
            const json = await res.json();
            resolve(json);
        } catch (e) {
            reject(e);
        }
    });
};

export const modify_geojson_features = payload => {
    return new Promise(async (resolve, reject) => {
        try {
            await make_http_request(`${GEOIMAGENET_API_URL}/annotations`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: payload,
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

export const geoserver_capabilities = (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            let parser = new ol.format.WMSCapabilities();
            const res = await make_http_request(url);
            const text = await res.text();
            const capabilities = parser.read(text);
            resolve(capabilities);
        } catch (e) {
            reject(e);
        }
    });
};
