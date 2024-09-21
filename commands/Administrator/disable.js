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

    const cmdName = args[0];
    if (!cmdName)
      return message.reply(
        "Pilih perintah yang ingin ditentukan `[on / off / list]`\n**Contoh: k!cmd ping on**"
      );

    const request = args[1];
    if (!request)
      return message.reply(
        "Pilih Opsi yang ingin ditentukan `[on / off / list]`\n**Contoh: k!cmd ping on**"
      );

    const cmd = client.commands.get(args[0])?.help;
    if (!cmd) return message.reply("tidak ditemukan perintahnya!");

    let guildCmd = await Command.findOne({ guild: message.guild.id });
    if (!guildCmd) {
      guildCmd = new Command({
        guild: message.guild.id,
        commands: [],
      });
    }

    const findCmd = guildCmd.commands.find((c) => c.name === cmd.name);
    if (!findCmd) {
      guildCmd.commands.push({
        name: cmd.name,
        channels: [],
      });

      await guildCmd.save();
    }

    const cmdIndex = guildCmd.commands.findIndex((c) => c.name === cmd.name);
    const cmdData = guildCmd.commands[cmdIndex];

    if (request === "on") {
      if (!cmdData.channels.includes(message.channel.id))
        return message.reply("Perintah ini tidak dimatikan di channel ini!");

      // remove channel from array
      cmdData.channels = cmdData.channels.filter(
        (c) => c !== message.channel.id
      );

      await guildCmd.save();

      return message.reply(
        `Perintah \`${cmd.name}\` telah diaktifkan di channel ini!`
      );
    } else if (request === "off") {
      if (cmdData.channels.includes(message.channel.id))
        return message.reply("Perintah ini sudah dimatikan di channel ini!");

      cmdData.channels.push(message.channel.id);

      await guildCmd.save();

      return message.reply(
        `Perintah \`${cmd.name}\` telah dimatikan di channel ini!`
      );
    } else if (request === "list") {
      const embed = new EmbedBuilder()
        .setTitle(
          `Daftar Channel yang diaktifkan untuk perintah \`${cmd.name}\``
        )
        .setDescription(
          cmdData.channels.map((c) => `<#${c}>`).join(", ") ||
            "Tidak ada channel yang diaktifkan!"
        )
        .setColor("Random")
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    } 
  } catch (error) {
    return message.reply("sepertinya ada kesalahan:\n" + error.message);
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
