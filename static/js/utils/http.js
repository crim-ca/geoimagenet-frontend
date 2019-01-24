export const make_http_request = (url, options) => {
    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    resolve(res);
                } else {
                    reject(res);
                }
            })
            .catch(err => { reject(err); });
    });
};
