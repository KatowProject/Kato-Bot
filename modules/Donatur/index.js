const {
  Message,
  GuildMember,
  WebhookClient,
  EmbedBuilder,
} = require("discord.js");
const moment = require("moment-timezone");

const Client = require("../../core/ClientBuilder");

const Donatur = require("../../database/schemas/donatur");
const Xp = require("../../database/schemas/xp");

moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = class DonaturManager {
  /**
   *
   * @param {Client} client
   */
  constructor(client) {
    this.client = client;
  }

  static convertXp(xp) {
    return parseInt(xp) * 10 * 0.25;
  }

  /**
   *
   * @param {GuildMember} member
   */
  async createBooster(member) {
    try {
      const xp = await Xp.findOne({ guild: member.guild.id });
      const userXp = xp.data.find((x) => x.id === member.id);
      if (!userXp) return;

      const donatur = await Donatur.findOne({ userID: member.id });
      if (donatur) return;

      await new Donatur({
        userID: member.id,
        guildID: member.guild.id,
        isBooster: true,
      }).save();

      this.client.emit("donaturManagerSuccess", {
        type: "createBooster",
        status: "success",
        data: {
          user: member,
          guild: member.guild,
          isBooster: true,
        },
      });
    } catch (err) {
      this.client.emit("donaturManagerError", {
        type: "createBooster",
        status: "error",
        error: err,
      });
    }
  }

  /**
   *
   * @param {GuildMember} member
   * @param {Number} duration
   */
  async createDonatur(member, duration) {
    try {
      const xp = await Xp.findOne({ guild: member.guild.id });
      const userXp = xp.data.find((x) => x.id === member.id);
      if (!userXp) return;

      const donatur = await Donatur.findOne({ userID: member.id });
      if (donatur) return;

      await new Donatur({
        userID: member.id,
        guildID: member.guild.id,
        time: {
          duration,
        },
      }).save();

      this.client.emit("donaturManagerSuccess", {
        type: "createDonatur",
        status: "success",
        data: {
          user: member,
          guild: member.guild,
          duration,
        },
      });
    } catch (err) {
      this.client.emit("donaturManagerError", {
        type: "createDonatur",
        status: "error",
        error: err,
      });
    }
  }

  /**
   * Check donatur duration
   */
  async checkDonaturDuration() {
    try {
      const donaturs = await Donatur.find();
    } catch (err) {
      this.client.emit("donaturManagerError", {
        type: "checkDonaturDuration",
        status: "error",
        error: err,
      });
    }
  }
};
