const axios = require("axios");
const baseURL = "https://discord.com/api/v9";

class HTTP extends axios {
  constructor(client) {
    super();

    this.device = client.device;
    this.request = axios.create({
      baseURL,
      headers: {
        "User-Agent": this.device.browser_user_agent,
        "X-Super-Properties": Buffer.from(JSON.stringify(this.device)).toString(
          "base64"
        ),
      },
      responseType: "json",
    });
  }

  async get(url, options = {}) {
    return this.request.get(url, options);
  }

  async post(url, data = {}, options = {}) {
    return this.request.post(url, data, options);
  }
}

module.exports = HTTP;
