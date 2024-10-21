/* eslint-disable no-async-promise-executor */
const m_shop = require("../../database/schemas/shop_event");
const m_user = require("../../database/schemas/user_event");
const m_xp = require("../../database/schemas/xp");

const Client = require("../../core/ClientBuilder");

class KatoShopManager {
  /**
   *
   * @param {Client} client
   * @param {Object} option
   */
  constructor(client, option) {
    this.client = client;
    this.option = option;
  }

  /**
   * Get all products
   * @returns {Promise<Array>} Array of products
   */
  getProducts() {
    return new Promise(async (resolve, reject) => {
      try {
        const products = await m_shop.find({}).exec();
        resolve(products);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * @param {String} id
   */
  getProductById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const product = await m_shop.findOne({ id });
        return resolve(product);
      } catch (e) {
        reject(e);
      }
    });
  }

  addProduct(product) {
    return new Promise(async (resolve, reject) => {
      try {
        const newProduct = new m_shop(product);
        await newProduct.save();

        resolve(newProduct);
      } catch (e) {
        reject(e);
      }
    });
  }

  editProduct(id, product) {
    return new Promise(async (resolve, reject) => {
      try {
        await m_shop.findOneAndUpdate({ id }, product).exec();
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }

  deleteProduct(id) {
    return new Promise(async (resolve, reject) => {
      try {
        await m_shop.findOneAndDelete({ id }).exec();
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }

  async resetDaily() {
    const Xp = await m_xp.findOne({}).exec();
    const users = await m_user.find({}).exec();

    for (const user of users) {
      const userXp = Xp.find((x) => x.id === user.userID);
      user.messageBase = userXp.message_count;
      user.messageCount = 0;
      user.isComplete = false;
      user.isAttend = false;

      await user.save();
    }

    return true;
  }

  async checkMessage() {
    const Xp = await m_xp.findOne({}).exec();
    const users = await m_user.find({}).exec();

    for (const user of users) {
      const userXp = Xp.find((x) => x.id === user.userID);

      user.messageCount = userXp.message_count - user.messageBase;
      user.isComplete = user.messageCount >= this.option.messageCount;

      if (user.isComplete) {
        const u = await this.client.users.fetch(user.userID, { force: true });
        u.send(`Selamat, kamu telah menyelesaikan event harian. kamu mendapatkan 1 ticket`);
      }

      await user.save();
    }
  }
}

module.exports = KatoShopManager;
