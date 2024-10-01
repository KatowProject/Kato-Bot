const Client = require("../core/ClientBuilder");
const { Message, AttachmentBuilder, WebhookClient } = require("discord.js");
const DiscordCanvas = require("../modules/Discord-Canvas");
const ms = require("ms");
const path = require("path");

const canvas = new DiscordCanvas();

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  if (message.channel.id !== client.config.trakteer.discord_channel_log) return;

  const data = client.util.isJSON(message.content)
    ? JSON.parse(message.content)
    : null;
  if (!data) return;

  const name = data.supporter_name;
  const value = data.quantity;
  const duration = value * 28;
  const duration_ms = ms(`${duration}d`);
  const supporterMessage = data.supporter_message;
  const donaturDate = data.created_at;
  const price = data.price;

  const members = await message.guild.members.fetch({ force: true });
  const member = members.find((m) => m.user.username === name);

  const donaturPoster = canvas.donaturNotification();
  donaturPoster.setUsername(name);
  donaturPoster.setSupportMessage(supporterMessage);
  donaturPoster.setDate(new Date(donaturDate));
  donaturPoster.setDonation(value);
  donaturPoster.setNominal(price);

  if (member) {
    await donaturPoster.setAvatar(
      member.user.displayAvatarURL({ extension: "png", size: 4096 })
    );
  } else {
    await donaturPoster.setAvatar(
      path.join(__dirname, "../", "assets", "santai.png")
    );
  }

  const buffer = await donaturPoster.generate();
  const attachment = new AttachmentBuilder(buffer, {
    name: "donatur-notification.png",
  });

  const url = client.config.trakteer.notification_webhook;
  const webhook = new WebhookClient({ url });

  webhook.send({
    files: [attachment],
  });

  client.donatur.createDonatur(member, duration_ms);
};
