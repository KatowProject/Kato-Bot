const axios = require("axios");
const { Client, Message, EmbedBuilder, Embed } = require("discord.js");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */
exports.run = async (client, message) => {
  try {
    const response = await axios.get("https://nekos.life/api/v2/8ball");
    const ball = response.data;

    const embed = new EmbedBuilder().setColor("Random");
    embed
      .setTitle("🎱 8ball")
      .setDescription(ball.response)
      .setImage(ball.url)
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
  name: "8ball",
  description: "8ball",
  usage: "8ball",
  example: "8ball",
};
