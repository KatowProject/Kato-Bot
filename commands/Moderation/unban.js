const { Message, EmbedBuilder } = require("discord.js");
const Client = require("../../core/ClientBuilder");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

exports.run = async (client, message, args) => {
  try {
    const member = args[0];
    const author = message.guild.members.cache.get(message.author.id);

    // Ketika tidak ada ID
    if (!member) return message.reply("Kamu tidak mencantumkan IDnya!");

    // Ketika yang mengunban adalah member
    if (!author.permissions.has("BanMembers"))
      return message.reply(
        "Kamu adalah member biasa, Kamu tidak bisa menggunakan command ini!"
      );

    message.guild.members
      .unban(member)
      .then(() => {
        message.reply(`Anda berhasil melepas banned dari **${member}**!`);
      })
      .catch((err) => {
        message.reply(`Sepertinya ada masalah!\n\`\`\`${err.message}\`\`\``);
      });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `UNBAN | ${member}`,
        iconURL: message.guild.iconURL(),
      })
      .setColor("Random")
      .addFields(
        { name: "User", value: `<@${member}>`, inline: true },
        { name: "Moderator", value: `<@${message.author.id}>`, inline: true }
      )
      .setTimestamp()
      .setFooter({
        text: `ID: ${message.member.id}`,
        iconURL: message.guild.iconURL(),
      });

    client.channels.cache
      .get(client.config.discord.channel_message.log)
      .send({ embeds: [embed] });
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
  name: "unban",
  description: "mengurungkan blokir pada user di server",
  usage: "unban <userID>",
  example: "unban ",
};
