const HTTP = require("./HTTP.js");
const UAParser = require("ua-parser-js");
const axios = require("axios").default;

class Discord {
  constructor(token, opt) {
    if (typeof token === "undefined")
      throw new Error("Token is not a string or object");
    this.tokens = token;
    this.options = opt;

    this.request = null;
    this.device = null;
  }

  async init(f) {
    const createDevice = async () => {
      const UAs = await axios
        .get("https://jnrbsn.github.io/user-agents/user-agents.json")
        .then((res) => res.data);
      const UserAgent = new UAParser(
        UAs[Math.floor(Math.random() * UAs.length)]
      );

      const discordBuild = await axios
        .get(
          "https://raw.githubusercontent.com/Pixens/Discord-Build-Number/refs/heads/main/discord.json"
        )
        .then((res) => res.data);

      this.device = {
        os: UserAgent.getOS().name,
        browser: UserAgent.getBrowser().name,
        device: UserAgent.getDevice().name || "",
        system_locale: "en-US",
        browser_user_agent: UserAgent.getUA(),
        browser_version: UserAgent.getBrowser().version,
        os_version: UserAgent.getOS().version,
        referrer: "",
        referring_domain: "",
        referrer_current: "",
        referring_domain_current: "",
        release_channel: "stable",
        client_build_number: discordBuild.client_build_number,
        client_event_source: null,
      };

      this.request = new HTTP(this);
      this.loaded = true;
    };

    if (f === true || !this.loaded) return await createDevice();
    if (this.loaded) throw new Error("Already loaded");
  }

  async getMessages(channel, limit = 10, random = false) {
    if (!this.loaded) throw new Error("Service not loaded");

    try {
      random
        ? (this.request.defaults.headers.Authorization = this.randomNumber(
            this.tokens
          ))
        : (this.request.defaults.headers.Authorization = this.tokens[0]);

      const url = `/channels/${channel}/messages?limit=${limit}`;
      const response = await this.request.get(url);

      return response.data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async sendMessage(channel, message, random = false) {
    if (!this.loaded) throw new Error("Service not loaded");
    try {
      random
        ? (this.request.defaults.headers.Authorization = this.randomNumber(
            this.tokens
          ))
        : (this.request.defaults.headers.Authorization = this.tokens[0]);

      const url = `/channels/${channel}/messages`;
      //generate unix epoch time
      const xxxx = (Date.now() - 1420070400000) * 4194304;
      const response = await this.request.post(url, {
        content: message,
        tts: false,
        nonce: xxxx,
      });
      return response.data;
    } catch (err) {
      //get status text
      throw new Error(err);
    }
  }

  changeToken(tkn) {
    if (typeof tkn === "string")
      this.request.defaults.headers.Authorization = tkn;
    else throw new Error("Token is not a string");
  }

  randomNumber(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

module.exports = Discord;
