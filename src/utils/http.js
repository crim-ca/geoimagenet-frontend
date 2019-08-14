// @flow strict
export const make_http_request = async (url, options) => {
    try {
        const res = await fetch(url, options);
        if (res.ok) {
            return res;
        }
        return Promise.reject(res);
    } catch (e) {
        return Promise.reject(e);
    }
};

export const post_json = (url, payload) => {
    return make_http_request(url, {
        method: 'POST',
        body: payload,
        headers: {
            'content-type': 'application/json',
        },
    });
};

export const put_json = async (url, payload) => {
    return make_http_request(url, {
        method: 'PUT',
        body: payload,
        headers: {
            'content-type': 'application/json',
        },
    });
};
