const HTTP = require('./HTTP.js');
const UAParser = require('ua-parser-js');
const axios = require('axios');
class Discord {
    constructor(token, opt) {
        if (typeof token === 'undefined') throw new Error('Token is not a string or object');
        this.tokens = token;
        this.options = opt;
    }

    async init(f) {
        const createDevice = async () => {
            const UAs = await axios.get('https://jnrbsn.github.io/user-agents/user-agents.json').then(res => res.data);
            const UserAgent = new UAParser(UAs[Math.floor(Math.random() * UAs.length)]);
            this.device = {
                os: UserAgent.getOS().name,
                browser: UserAgent.getBrowser().name,
                device: UserAgent.getDevice().name || '',
                system_locale: 'en-US',
                browser_user_agent: UserAgent.getUA(),
                browser_version: UserAgent.getBrowser().version,
                os_version: UserAgent.getOS().version,
                referrer: '',
                referring_domain: '',
                referrer_current: '',
                referring_domain_current: '',
                release_channel: 'stable',
                client_build_number: 172394,
                client_event_source: null
            }

            this.request = new HTTP(this);
            this.loaded = true;
        }

        if (f === true || !this.loaded) return await createDevice();
        if (this.loaded) throw new Error('Already loaded');
    }
}

module.exports = Discord;