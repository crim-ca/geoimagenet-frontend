import {make_http_request} from '../utils/http.js';

export const release_annotations_request = id => {
    return new Promise((resolve, reject) => {
        make_http_request(`${GEOIMAGENET_API_URL}/annotations/release?taxonomy_class_id=${id}`, {method: 'POST'})
            .then(res => resolve(res))
            .catch(err => reject(err));
    });
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
            const res = await make_http_request(`${GEOIMAGENET_API_URL}/annotations/${root_taxonomy_class_id}/counts`);
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

export const delete_geojson_feature = payload => {
    return new Promise(async (resolve, reject) => {
        try {
            await make_http_request(`${GEOIMAGENET_API_URL}/annotations`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: payload,
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    })
};
