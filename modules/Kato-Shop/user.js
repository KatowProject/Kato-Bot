// const m_product = require("../../database/schemas/shop_event");
// const m_user = require("../../database/schemas/user_event");

const Client = require("../../core/ClientBuilder");

class KatoShopUser {
  /**
   *
   * @param {Client} client
   * @param {Object} options
   */
  constructor(client, option) {
    /** @type {Client} */
    this.client = client;

    /** @type {Object} */
    this.option = option;
  }
}

module.exports = KatoShopUser;
