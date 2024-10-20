// const m_product = require("../../database/schemas/shop_event");
const m_user = require("../../database/schemas/user_event");

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

  async register(user) {
    return new Promise(async (resolve, reject) => {
      try {
        const newUser = new m_user(user);
        await newUser.save();

        resolve(newUser);
      } catch (e) {
        reject(e);
      }
    });
  }

  async daily(user) {
    return new Promise(async (resolve, reject) => {
      try {
        const u = await m_user.findOne({ id: user.id });
        if (!u) {
          return reject("User not found");
        }

        if (u.daily) {
          return reject("You have claimed your daily reward");
        }

        u.daily = true;
        u.balance += 1000;
        await u.save();

        resolve(u);
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = KatoShopUser;
