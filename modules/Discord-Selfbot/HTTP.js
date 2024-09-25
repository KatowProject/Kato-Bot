const axios = require("axios");
const baseURL = "https://discord.com/api/v9";

class HTTP extends axios {
  constructor(client) {
    super();

    this.tokens = client.tokens;
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
}

module.exports = HTTP;
