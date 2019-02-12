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

export const post_json = async (url, payload) => {
    try {
        return await make_http_request(url, {
            method: 'POST',
            body: payload,
            headers: {
                'content-type': 'application/json',
            },
        });
    } catch (e) {
        return Promise.reject(e);
    }
};

export const put_json = async (url, payload) => {
    try {
        return await make_http_request(url, {
            method: 'PUT',
            body: payload,
            headers: {
                'content-type': 'application/json',
            },
        });
    } catch (e) {
        return Promise.reject(e);
    }
};
