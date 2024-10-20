/* eslint-disable no-async-promise-executor */
const m_shop = require("../../database/schemas/shop_event");
// const m_user = require("../../database/schemas/user_event");
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
}

module.exports = KatoShopManager;
