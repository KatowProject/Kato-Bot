const Client = require("../core/ClientBuilder");
const { GuildMember, AttachmentBuilder, WebhookClient } = require("discord.js");
const DiscordCanvas = require("../modules/Discord-Canvas");

const canvas = new DiscordCanvas();

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
  const boosterNotification = canvas.boosterNotification();

  boosterNotification.setUsername(member.user.username);
  boosterNotification.setDate(new Date());
  await boosterNotification.setAvatar(
    member.user.displayAvatarURL({ extension: "png" })
  );

  const buffer = await boosterNotification.generate();
  const attachment = new AttachmentBuilder(buffer, {
    name: "booster-notification.png",
  });

  const url = client.config.trakteer.notification_webhook;
  const webhook = new WebhookClient({ url });

  webhook.send({
    files: [attachment],
  });
};
