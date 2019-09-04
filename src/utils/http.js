// @flow strict
export const make_http_request = (url: string, options: RequestOptions = {}): Promise<Response> => {
    return new Promise((resolve, reject) => {
        fetch(url, options).then(
            response => {
                if (response.ok) {
                    resolve(response);
                } else {
                    reject(response);
                }
            },
            error => reject(error),
        );
    });
};

export const post_json = (url: string, payload: string) => {
    return make_http_request(url, {
        method: 'POST',
        body: payload,
        headers: {
            'content-type': 'application/json',
        },
    });
};

export const put_json = async (url: string, payload: string) => {
    return make_http_request(url, {
        method: 'PUT',
        body: payload,
        headers: {
            'content-type': 'application/json',
        },
    });
};
