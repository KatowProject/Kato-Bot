const axios = require('axios');
const baseURL = 'https://discord.com/api/v9';

class HTTP {
    constructor(client) {
        this.tokens = client.tokens;
        this.device = client.device;
        this.request = axios.create({
            baseURL,
            headers: {
                'User-Agent': this.device.browser_user_agent,
                'X-Super-Properties': Buffer.from(JSON.stringify(this.device)).toString('base64')
            },
            responseType: 'json'
        });
    }

    async getMessages(channel, limit = 10, random = false) {
        try {
            random ?
                this.request.defaults.headers.Authorization = this.randomNumber(this.tokens)
                : this.request.defaults.headers.Authorization = this.tokens[0];

            const url = `/channels/${channel}/messages?limit=${limit}`;
            const response = await this.request.get(url);

            return response.data;
        } catch (err) {
            throw new Error(err);
        }
    }

    async sendMessage(channel, message, random = false) {
        try {
            random ?
                this.request.defaults.headers.Authorization = this.randomNumber(this.tokens)
                : this.request.defaults.headers.Authorization = this.tokens[0];

            const url = `/channels/${channel}/messages`;
            //generate unix epoch time
            const xxxx = (Date.now() - 1420070400000) * 4194304;
            const response = await this.request.post(url, { content: message, tts: false, nonce: xxxx });
            return response.data;
        } catch (err) {
            //get status text
            throw new Error(err);
        }
    }

    changeToken(tkn) {
        if (typeof tkn === 'string')
            this.request.defaults.headers.Authorization = tkn;
        else
            throw new Error('Token is not a string');
    }

    randomNumber(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}

module.exports = HTTP;