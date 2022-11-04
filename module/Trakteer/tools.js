const baseURL = 'https://trakteer.id/';
const axios = require('axios');

function get(endpoint, options) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios.get(baseURL + endpoint, {
                headers: {
                    cookie: `XSRF-TOKEN=${options['XSRF-TOKEN']}; trakteer-sess=${options['trakteer-id-session']}`
                }
            })

            if (res.status === 200) return resolve(res);
            else reject(res);
        } catch (err) {
            const bypass = await bypass(baseURL + endpoint, 'get', {
                cookie: `XSRF-TOKEN=${options['XSRF-TOKEN']}; trakteer-sess=${options['trakteer-id-session']}`
            });
            if (bypass.status === 200) return resolve(bypass);
            else reject(bypass);
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

            if (res.status) return resolve(res);
            else reject(res);
        } catch (err) {
            reject(err);
        }
    });
}

function bypass(url, method, headers = {}, data = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const bs64 = Buffer.from(url).toString('base64');
            if (method === 'get') {
                const res = await axios.get("https://bypass.kato-rest.us/trakteer.php?q=" + bs64, {
                    headers: headers
                });
                if (res.status === 200) return resolve(res);
                else reject(res);
            } else if (method === 'post') {
                const res = await axios.post("https://bypass.kato-rest.us/?q=" + bs64, data);
                if (res.status === 200) return resolve(res);
                else reject(res);
            } else reject('Method not found');
        } catch (err) {
            reject(err);
        }
    });
}


module.exports = { get, post };