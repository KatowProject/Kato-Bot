const Client = require("../../../core/ClientBuilder");
const {
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const moment = require("moment");

const PERMISSION_ERROR = "You don't have permission to use this command.";

class OptionManager {
  /**
   *
   * @param {Client} client
   * @param {Message} message
   */
  constructor(client, message) {
    /** @type {Client} */
    this.client = client;

    /** @type {Message} */
    this.message = message;

    /** @type {Object} */
    this.option = {};

    this.msg = null;

    this.embed = null;
  }

  async init() {
    if (!this.message.member.permissions.has("Administrator"))
      return this.message.reply(PERMISSION_ERROR);

    this.option = this.client.katoShop.option;

    this.embed = this.createOptionEmbed(this.option);

    this.msg = await this.message.reply({
      embeds: [this.embed],
      components: [this.createActionButtons(this.option)],
    });

    this.createCollector();
  }

  createCollector() {
    const filter = (interaction) =>
      interaction.user.id === this.message.author.id && interaction.isButton();
    const collector = this.msg.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      await interaction.deferUpdate();
      switch (interaction.customId) {
        case "open_shop":
          this.toogleShop();
          break;
        case "close_shop":
          this.option.isOpen = false;
          break;
        case "message_count":
          this.option.messageCount = 5;
          break;
        case "interval":
          this.option.interval = 60000;
          break;
        case "notifications_channel":
          this.option.channel = "channel_id";
          break;
      }
    });
  }

  async toogleShop() {
    this.option.isOpen = !this.option.isOpen;

    await this.client.katoShop.changeOption(this.option);

    this.msg.edit({
      embeds: [this.createOptionEmbed(this.option)],
      components: [this.createActionButtons(this.option)],
    });

    this.message
      .reply("Shop is now " + (this.option.isOpen ? "open" : "closed"))
      .then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 5000);
      });
  }

  createActionButtons(option) {
    return new ActionRowBuilder().addComponents(
      option.isOpen
        ? new ButtonBuilder()
            .setCustomId("close_shop")
            .setLabel("Close Shop")
            .setStyle(ButtonStyle.Danger)
        : new ButtonBuilder()
            .setCustomId("open_shop")
            .setLabel("Open Shop")
            .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("message_count")
        .setLabel("Change Message Count")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("interval")
        .setLabel("Change Interval")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("notifications_channel")
        .setLabel("Change Notifications Channel")
        .setStyle(ButtonStyle.Primary)
    );
  }

  createOptionEmbed(option) {
    return new EmbedBuilder()
      .setTitle("Shop Options")
      .addFields(
        {
          name: "Shop Status",
          value: option.isOpen ? "🟢 Open" : "🔴 Closed",
        },
        {
          name: "Message Count",
          value: `${option.messageCount}`,
        },
        {
          name: "Interval",
          value: `${moment.duration(option.interval).minutes()} minutes`,
        },
        {
          name: "Notifications Channel",
          value: `<#${option.channel}>`,
        }
      )
      .setColor("Random")
      .setTimestamp();
  }
}

module.exports = OptionManager;
