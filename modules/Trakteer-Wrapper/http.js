const axios = require("axios").default;
const baseURL = "https://api.trakteer.id/v1/public/";

class Http {
  constructor(token) {
    this.token = token;
    if (!this.token) throw new Error("No token provided!");

    this.axios = axios.create({
      baseURL,
      headers: {
        key: this.token,
        Accept: "application/json",
      },
    });
  }

  async get(endpoint, params = {}) {
    return this.axios.get(endpoint, { params });
  }

  async post(endpoint, data = {}) {
    return this.axios.post(endpoint, data);
  }
}

module.exports = Http;
