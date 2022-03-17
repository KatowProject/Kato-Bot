const axios = require('axios');

class Discord {
    constructor(token) {
        if (typeof token === 'undefined') throw new Error('Token is not a string or object');

        this.api = 'https://discord.com/api/v9';
        this.dump = token;
        this.token = { headers: { Authorization: `${this.randomNumber(this.dump)}` } };
    }

    async getMessages(channel, limit = 10, random = false) {
        try {
            if (random) this.token.headers.Authorization = this.randomNumber(this.dump);
            const url = this.api + `/channels/${channel}/messages?limit=${limit}`;
            const response = await axios.get(url, this.token);

            return response.data;
        } catch (err) {
            throw new Error(err);
        }
    }

    async sendMessage(channel, message, random = false) {
        try {
            if (random) this.token.headers.Authorization = this.randomNumber(this.dump);
            const url = this.api + `/channels/${channel}/messages`;
            const response = await axios.post(url, { content: message }, this.token);

            return response.data;
        } catch (err) {
            //get status text
            throw new Error(err);
        }
    }

    changeToken(tkn) {
        if (typeof tkn === 'string')
            this.token.headers.Authorization = tkn;
        else
            throw new Error('Token is not a string');
    }

    randomNumber(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}

module.exports = Discord;