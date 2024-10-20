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
        case "close_shop":
          this.toogleShop();
          break;
        case "message_count":
          this.changeMessageCount();
          break;
        case "interval":
          this.changeInterval();
          break;
        case "notifications_channel":
          this.changeNotificationsChannel();
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

  async changeMessageCount() {
    const msg = await this.message.reply("Enter the new message count");
    const filter = (m) => m.author.id === this.message.author.id;
    const collector = this.message.channel.createMessageCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (m) => {
      if (isNaN(m.content)) {
        m.reply("Invalid number");
        return;
      }

      this.option.messageCount = parseInt(m.content);
      await this.client.katoShop.changeOption(this.option);

      this.msg.edit({
        embeds: [this.createOptionEmbed(this.option)],
        components: [this.createActionButtons(this.option)],
      });

      m.reply("Message count has been changed to " + this.option.messageCount);
      msg.delete();
      collector.stop();
    });
  }

  async changeInterval() {
    const msg = await this.message.reply(
      "Enter the new interval (in milliseconds)"
    );
    const filter = (m) => m.author.id === this.message.author.id;
    const collector = this.message.channel.createMessageCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (m) => {
      if (isNaN(m.content)) {
        m.reply("Invalid number");
        return;
      }

      this.option.interval = parseInt(m.content);
      await this.client.katoShop.changeOption(this.option);

      this.msg.edit({
        embeds: [this.createOptionEmbed(this.option)],
        components: [this.createActionButtons(this.option)],
      });

      m.reply("Interval has been changed to " + this.option.interval);
      msg.delete();
      collector.stop();
    });
  }

  async changeNotificationsChannel() {
    const msg = await this.message.reply("Enter the new notifications channel");

    const filter = (m) => m.author.id === this.message.author.id;
    const collector = this.message.channel.createMessageCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (m) => {
      // using id or mention
      const channel =
        m.mentions.channels.first() ||
        this.message.guild.channels.cache.get(m.content);
      if (!channel) {
        m.reply("Invalid channel");
        return;
      }

      this.option.channel = channel.id;
      await this.client.katoShop.changeOption(this.option);

      this.msg.edit({
        embeds: [this.createOptionEmbed(this.option)],
        components: [this.createActionButtons(this.option)],
      });

      m.reply(`Notifications channel has been changed to <#${channel.id}>`);
      msg.delete();
      collector.stop();
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
