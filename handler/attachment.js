const { Message, AttachmentBuilder } = require("discord.js");
const axios = require("axios").default;
const Kato = require("../core/ClientBuilder");

/**
 * @param {Kato} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  if (!message.attachments.size) return;

  const collection = client.cache;
  const attachment = message.attachments.first();
  if (!attachment) return;

  const { url, name } = attachment;
  const buffer = await axios.get(url, { responseType: "arraybuffer" });

  const file = new AttachmentBuilder().setFile(buffer.data).setName(name);

  collection.set(message.id, file);
};
