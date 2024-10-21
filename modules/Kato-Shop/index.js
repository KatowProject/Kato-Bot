const KatoShopManager = require("./manager");
const KatoShopUser = require("./user");

const Client = require("../../core/ClientBuilder");
const m_option = require("../../database/schemas/config_event");

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta");

class KatoShop {
  /**
   *
   * @param {Client} client Discord Client
   * @param {boolean} [init=true] Initialize the module
   */
  constructor(client, init = true) {
    /** @type {Client} */
    this.client = client;

    this.option = null;

    /** @type {KatoShopManager | null} */
    this.manager = null;

    /** @type {KatoShopUser | null} */
    this.user = null;

    if (init) this._init();
  }

  /**
   * Change the option of the module
   * @param {Object} option
   * @returns {Promise<void>}
   */
  async changeOption(option) {
    await m_option.findOneAndUpdate({}, option).exec();

    this.option = option;
    this.manager.option = option;
    this.user.option = option;
  }

  _init() {
    this.client.once("ready", async () => {
      console.log("Kato Shop Module is ready!");
      this.option = await m_option.findOne({}).exec();

      if (!this.option) {
        this.option = {
          id: "932997958738268251",
          interval: 60_000,
          isOpen: false,
          messageCount: 5,
          channel: "932997960923480099",
        };

        await new m_option(this.option).save();
      }

      this.manager = new KatoShopManager(this.client, this.option);
      this.user = new KatoShopUser(this.client, this.option);

      setInterval(() => {
        const now = moment().format("HH:mm");
        if (now === "00:00") {
          this.manager.resetDaily();
        } else {
          this.manager.checkMessage();
        }
      }, this.option.interval || 60_000);
    });
  }
}

module.exports = KatoShop;
