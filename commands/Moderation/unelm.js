const { Message, EmbedBuilder } = require("discord.js");
const Client = require("../../core/ClientBuilder");

const ELM = require("../../database/schemas/elm");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

exports.run = async (client, message, args) => {
  try {
    if (!message.guild.members.me.permissions.has("MuteMembers"))
      return message.channel.send("Aku tidak mempunyai akses!");

    let korban =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!korban) return message.channel.send("tag user yang ingin di unelm!");

    //cari data
    const member = await ELM.findOne({ userID: korban.id });
    if (!member) return message.reply("Member gk kena ELM!");

    for (const user of member.roles) {
      korban.roles.add(user);
    }

    const ELMs = message.guild.roles.cache.find((a) => a.name == "ELM");
    korban.roles.remove(ELMs).then(() => {
      message.delete();
      message.channel.send(
        `**${korban.user.username}#${korban.user.discriminator}** telah selesai di unelm.`
      );
    });
    await ELM.findOneAndDelete({ userID: korban.id });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `UNELM | ${korban.user.tag}`,
        iconURL: korban.user.displayAvatarURL(),
      })
      .setColor("Random")
      .addFields(
        { name: "User", value: `<@${korban.id}>`, inline: true },
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
  aliases: ["bebas"],
  cooldown: 5,
  location: __filename,
};

exports.help = {
  name: "unelm",
  description: "melepaskan role ELM",
  usage: "k!unelm <user>",
  example: "k!unelm @juned",
};
