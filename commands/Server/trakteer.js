const Client = require("../../core/ClientBuilder");
const { Message, EmbedBuilder } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */
exports.run = async (client, message, args) => {
  try {
    const option = args[0];
    switch (option) {
      case "saldo":
        client.trakteer.cekSaldo(message);
        break;
      case "donatur":
        client.trakteer.cekDonatur(message);
        break;

      case "leaderboard":
        client.trakteer.leaderboard(message);
        break;

      case "kas":
        client.trakteer.cekHistoryKas(message);
        break;
      default:
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Trakteer Command")
              .setDescription(
                "```js\n" +
                  `saldo\n` +
                  `donatur\n` +
                  `leaderboard\n` +
                  `kas\n` +
                  "```" +
                  "Contoh penggunaan: `trakteer saldo`"
              )
              .setColor("Random")
              .setFooter({
                text: "trakteer.id/santai",
                iconURL: message.guild.iconURL(),
              }),
          ],
        });
    }
  } catch (error) {
    console.log(error);
    return message.reply("sepertinya ada kesalahan\n" + error.message);
    // Restart the bot as usual.
  }
};

exports.conf = {
  aliases: ["tr"],
  cooldown: 1,
  location: __filename,
};

exports.help = {
  name: "trakteer",
  description: "trakteer",
  usage: "trakteer",
  example: "trakteer",
};
