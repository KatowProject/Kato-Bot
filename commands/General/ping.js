const { EmbedBuilder, Message } = require("discord.js");
const Kato = require("../../core/ClientBuilder");
/**
 *
 * @param {Kato} client
 * @param {Message} message
 * @param {[]} args
 */
exports.run = async (client, message) => {
  const m = await message.channel.send("Pinging...");

  const embed = new EmbedBuilder()
    .setTitle("Pong!")
    .setDescription(
      `🏓 **Latency:** ${m.createdTimestamp - message.createdTimestamp}ms\n` +
        `💓 **API:** ${client.ws.ping}ms`
    )
    .setColor("Random")
    .setTimestamp();

  m.edit({ embeds: [embed] });
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  location: __filename,
};

exports.help = {
  name: "ping",
  description: "Ping command",
  usage: "ping",
  example: "ping",
};
