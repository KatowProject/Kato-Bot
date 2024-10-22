/* eslint-disable no-async-promise-executor */
const m_product = require("../../database/schemas/shop_event");
const m_user = require("../../database/schemas/user_event");
const m_donatur = require("../../database/schemas/donatur");
const xp_user = require("../../database/schemas/xp");

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
      if (!this.option.isOpen) return reject("Event belum dibuka atau sudah ditutup");
      try {
        const Xp = await xp_user.findOne({ id: "932997958738268251" });
        if (!Xp) return reject("XP not found, please contact the developer");

        const userXp = await Xp.data.find((x) => x.id === user.id);
        if (!userXp) return reject("User tidak terdaftar, level masih belum mencapai level 5");

        const u = await m_user.findOne({ userID: user.id });
        if (u) return reject("User already registered");

        const newUser = new m_user({
          userID: user.id,
          messageBase: userXp.message_count,
        });

        await newUser.save();

        resolve(newUser);
      } catch (e) {
        reject(e);
      }
    });
  }

  async daily(user) {
    return new Promise(async (resolve, reject) => {
      if (!this.option.isOpen) return reject("Event sudah ditutup");
      try {
        const ud = await m_donatur.findOne({ userID: user.id });
        if (!ud) return reject("User not registered as donatur");

        const u = await m_user.findOne({ userID: user.id });
        if (!u) return reject("User not registered");

        if (u.isAttend) return reject("Sudah mengambil daily reward");

        u.ticket += 1;
        u.isAttend = true;

        await u.save();

        resolve(u);
      } catch (e) {
        reject(e);
      }
    });
  }

  async getProducts() {
    return new Promise(async (resolve, reject) => {
      if (!this.option.isOpen) return reject("Event sudah ditutup");
      try {
        const products = await m_product.find({ isAvailable: true });

        resolve(products);
      } catch (e) {
        reject(e);
      }
    });
  }

  async buyProduct(user, product) {
    return new Promise(async (resolve, reject) => {
      if (!this.option.isOpen) return reject("Event sudah ditutup");
      try {
        const u = await m_user.findOne({ userID: user.id });
        if (!u) return reject("User not registered");

        if (product.stock <= 0) return reject("Produk sudah habis");
        if (u.alreadyPurchase.includes(product.id)) return reject("Produk sudah dibeli, tidak bisa membeli lagi");
        if (u.ticket < product.price) return reject("Ticket tidak cukup");

        u.ticket -= product.price;
        u.alreadyPurchase.push(product.id);

        await u.save();

        product.stock -= 1;
        await product.save();

        resolve({ user: u, product });
      } catch (e) {
        reject(e);
      }
    });
  }

  async balance(user) {
    return new Promise(async (resolve, reject) => {
      try {
        const u = await m_user.findOne({ userID: user.id });
        if (!u) return reject("User not registered");

        resolve(u);
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = KatoShopUser;
