const baseURL = 'https://trakteer.id/';
const axios = require('axios');

function get(endpoint, options) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios.get(baseURL + endpoint, {
                headers: {
                    cookie: `XSRF-TOKEN=${options['XSRF-TOKEN']}; trakteer-id-session=${options['trakteer-id-session']}`
                }
            })

            if (res.status === 200) return resolve(res);
            else reject(res);
        } catch (err) {
            reject(err.message);
        }
    });
}

function post(json, url) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios.post(url, json, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 204) return resolve(res);
            else reject(res);
        } catch (err) {
            reject(err);
        }
    });
}


module.exports = { get, post };