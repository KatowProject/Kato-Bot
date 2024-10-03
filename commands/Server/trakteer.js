const Client = require("../../core/ClientBuilder");
const { Message } = require("discord.js");

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
        return message.reply("Tidak ada opsi yang ditemukan!");
    }
  } catch (error) {
    console.log(error);
    return message.reply("sepertinya ada kesalahan\n" + error.message);
    // Restart the bot as usual.
  }
};

exports.conf = {
  aliases: [],
  cooldown: 1,
  location: __filename,
};

exports.help = {
  name: "trakteer",
  description: "trakteer",
  usage: "trakteer",
  example: "trakteer",
};
