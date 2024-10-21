const { Message } = require("discord.js");
const Client = require("../../core/ClientBuilder");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {Array} args
 */
exports.run = async (client, message) => {
  const user = message.author;

  try {
    await client.katoShop.user.daily(user);
    message.reply(`Berhasil mendapatkan daily reward!`);
  } catch (e) {
    message.reply(`Gagal mendapatkan daily reward, \`${e}\``);
  }
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  location: __filename,
};

exports.help = {
  name: "daily",
  description: "Daily Kato Shop",
  usage: "daily",
  example: "daily",
};
