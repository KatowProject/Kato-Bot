const axios = require("axios");
const { Client, Message, EmbedBuilder, Embed } = require("discord.js");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */
exports.run = async (client, message) => {
  try {
    const response = await axios.get("https://nekos.life/api/v2/img/smug");
    const smug = response.data;

    const embed = new EmbedBuilder().setColor("Random");
    embed
      .setTitle("😏")
      .setImage(smug.url)
      .setFooter({
        iconURL: message.author.avatarURL(),
        text: message.author.username,
      })
      .setTimestamp();
    message.channel.send({ embeds: [embed] });
  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  location: __filename,
};

exports.help = {
  name: "smug",
  description: "get a random smug",
  usage: "smug",
  example: "smug",
};
