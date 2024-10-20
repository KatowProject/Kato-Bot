const { Message } = require("discord.js");
const Client = require("../../core/ClientBuilder");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {Array} args
 */
exports.run = async (client, message, args) => {};

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
