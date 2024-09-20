const { EmbedBuilder, Message } = require("discord.js");
const Client = require("../../core/ClientBuilder");

const Command = require("../../database/schemas/command");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

exports.run = async (client, message, args) => {
  try {
    if (!message.member.permissions.has("ManageChannels"))
      return message.reply(
        "Kamu tidak memiliki izin untuk menggunakan perintah ini!"
      );

    const request = args.join(" ");
    if (!request)
      return message.reply(
        "Pilih Opsi yang ingin ditentukan `[on / off]`\n**Contoh: k!cmd ping on**"
      );

    const cmd = client.commands.get(args[0])?.help;
    if (!cmd) return message.reply("tidak ditemukan perintahnya!");

    let guildCmd = await Command.findOne({ guild: message.guild.id });
    if (!guildCmd) {
      guildCmd = new Command({
        guild: message.guild.id,
        commands: [],
      });

      await guildCmd.save();
    }

    const command = guildCmd.commands.find((c) => c.name === cmd.name);
    console.log(command);
  } catch (error) {
    return message.reply("sepertinya ada kesalahan:\n" + error.message);
    // Restart the bot as usual.
  }
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  location: __filename,
};

exports.help = {
  name: "cmd",
  description: "matiin, nyalain, dan lihat data perintah",
  usage: "cmd <command> <on/off>",
  example: "cmd ping off",
};
