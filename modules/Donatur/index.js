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
   * @param {GuildMember} member
   */
  async createBooster(member) {
    try {
      const xp = await Xp.findOne({ guild: member.guild.id });
      const userXp = xp.data.find((x) => x.id === member.id);
      if (!userXp) return;

      const donatur = await Donatur.findOne({ userID: member.id });

      if (donatur) {
        if (!donatur.isBooster) throw new Error("User is already a donatur.");
        donatur.isBooster = true;

        await donatur.save();
      } else {
        await new Donatur({
          userID: member.id,
          guildID: member.guild.id,
          isBooster: true,
          message: {
            daily: 0,
            base: userXp.message_count,
          },
        }).save();
      }

      this.client.emit("donaturManager", {
        type: "createBooster",
        status: "success",
        user: member,
        data: {
          user: member,
          guild: member.guild,
          isBooster: true,
        },
      });
    } catch (err) {
      this.client.emit("donaturManager", {
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
      if (!member)
        return this.client.emit("donaturManager", {
          type: "createDonatur",
          status: "error",
          error: "Member tidak ditemukan.",
        });
      
      const xp = await Xp.findOne({ guild: member.guild.id });
      const userXp = xp.data.find((x) => x.id === member.id);
      if (!userXp) return;

      const donatur = await Donatur.findOne({ userID: member.id });
      if (donatur) {
        donatur.time.duration += duration;

        await donatur.save();

        this.client.emit("donaturManager", {
          type: "donaturDuration",
          status: "extend",
          data: {
            user: member,
            guild: member.guild,
            duration,
          },
        });
      } else {
        await new Donatur({
          userID: member.id,
          guildID: member.guild.id,
          time: {
            duration,
          },
          message: {
            daily: 0,
            base: userXp.message_count,
          },
        }).save();

        member.roles.add("932997958788608044");

        this.client.emit("donaturManager", {
          type: "createDonatur",
          status: "success",
          data: {
            user: member,
            guild: member.guild,
            duration,
          },
        });
      }
    } catch (err) {
      this.client.emit("donaturManager", {
        type: "createDonatur",
        status: "error",
        error: err,
      });
    }
  }

  /**
   * Check donatur duration
   * @return {Promise<void>}
   */
  async checkDonaturDuration() {
    try {
      const donaturs = await Donatur.find();
      for (const donatur of donaturs) {
        const guild = await this.client.guilds.fetch({
          guild: donatur.guildID,
          force: true,
        });
        const member = await guild.members.fetch({
          user: donatur.userID,
          force: true,
        });

        if (!member) {
          const now = Date.now();
          const past = donatur.time.now;

          const timeLeft = donatur.time.duration - (now - past);

          if (timeLeft <= 0)
            await Donatur.deleteOne({ userID: donatur.userID });

          continue;
        }

        if (member.premiumSince) {
          donatur.isBooster = true;

          await donatur.save();
        } else {
          donatur.isBooster = false;
        }

        if (donatur.isBooster) continue;

        const now = Date.now();
        const past = donatur.time.now;

        const timeLeft = donatur.time.duration - (now - past);
        if (timeLeft <= 0) {
          await Donatur.deleteOne({ userID: donatur.userID });

          member.roles.remove("932997958788608044");

          this.giveXpDonatur(
            DonaturManager.convertXp(donatur.message.daily),
            member.id
          );

          this.client.emit("donaturManager", {
            type: "donaturDuration",
            status: "expired",
            data: {
              user: member,
              guild,
              timeLeft,
            },
          });
        }
      }
    } catch (err) {
      console.log(err);
      this.client.emit("donaturManager", {
        type: "donaturDuration",
        status: "error",
        error: err,
      });
    }
  }

  async dailyDonatur(reset = false) {
    try {
      const time = moment().format("HH:mm");

      if (time === "00:00" || time === "12:00" || reset) {
        this.__resetDailyDonatur();
      } else {
        this.__xpDonatur();
      }
    } catch (err) {
      this.client.emit("donaturManager", {
        type: "dailyDonatur",
        status: "error",
        error: err,
      });
    }
  }

  async __xpDonatur() {
    const donaturs = await Donatur.find();
    const xps = await Xp.findOne();

    for (const donatur of donaturs) {
      const guild = this.client.guilds.cache.get(donatur.guildID);
      const member = guild.members.cache.get(donatur.userID);

      if (!member) continue;

      const userXp = xps.data.find((x) => x.id === member.id);
      if (!userXp) continue;

      donatur.message.daily = userXp.message_count - donatur.message.base;

      // check if document exists (because it's possible to be deleted)
      const doc = await Donatur.findOne({ userID: donatur.userID });
      if (!doc) return;

      await donatur.save();
    }
  }

  async __resetDailyDonatur() {
    const donaturs = await Donatur.find();
    const xps = await Xp.findOne();

    for (const donatur of donaturs) {
      const guild = this.client.guilds.cache.get(donatur.guildID);
      const member = guild.members.cache.get(donatur.userID);

      if (!member) continue;

      const userXp = xps.data.find((x) => x.id === member.id);
      if (!userXp) continue;

      const xp = DonaturManager.convertXp(donatur.message.daily);
      if (xp > 0) this.giveXpDonatur(xp, member.id);

      donatur.message.daily = 0;
      donatur.message.base = userXp.message_count;

      await donatur.save();
    }
  }

  async giveXpDonatur(xp, id) {
    this.client.selfbot.sendMessage(
      this.client.config.discord.channel_message.bot,
      `!give-xp <@${id}> ${xp}`,
      true
    );
  }

  async getDonatur(guildId) {
    if (!guildId) throw new Error("Guild ID is required.");
    try {
      const donaturs = await Donatur.find({ guildID: guildId });
      return donaturs;
    } catch (err) {
      this.client.emit("donaturManager", {
        type: "getDonatur",
        status: "error",
        error: err,
      });
    }
  }

  async getDonaturById(userId) {
    if (!userId) throw new Error("User ID is required.");
    try {
      const donatur = await Donatur.findOne({ userID: userId });
      return donatur;
    } catch (err) {
      console.log(err);
    }
  }

  init() {
    setInterval(async () => {
      await this.dailyDonatur();
      await this.checkDonaturDuration();
    }, 60_000);

    console.log("[DonaturManager] Ready!");
  }
};
