const Axios = require("./http");

class Trakteer {
  constructor(token) {
    this.token = token;
    if (!this.token) throw new Error("No token provided!");

    this.http = new Axios(this.token);
  }

  async transactionHistory(limit = 10, page = 1) {
    const res = await this.http.get("transactions", { limit, page });

    return res.data;
  }

  async currentBalance() {
    const res = await this.http.get("current-balance");

    return res.data;
  }

  async supportHistory(limit = 10, page = 1) {
    const res = await this.http.get("supports", { limit, page });

    return res.data;
  }

  async quantityGiven(email) {
    if (!email) throw new Error("No email provided!");

    const res = await this.http.post("quantity", { email });

    return res.data;
  }
}

module.exports = Trakteer;
