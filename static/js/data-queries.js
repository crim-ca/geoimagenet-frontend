import {make_http_request} from './utils/http.js';

export const release_annotations_by_taxonomy_class_id = id => {
    return new Promise((resolve, reject) => {
        make_http_request(`${GEOIMAGENET_API_URL}/annotations/release?taxonomy_class_id=${id}`, {method: 'POST'})
            .then(res => resolve(res))
            .catch(err => reject(err));
    });
};
