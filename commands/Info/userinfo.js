const Client = require("../../core/ClientBuilder");
const { Message, EmbedBuilder } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */
exports.run = async (client, message) => {
  try {
    const member = message.mentions.members.first() || message.member;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL(),
      })
      .setThumbnail(member.user.displayAvatarURL())
      .addFields([
        { name: "Username", value: member.user.username, inline: true },
        { name: "ID", value: member.user.id, inline: true },
        {
          name: "Status",
          value: member.presence?.status ?? "Online",
          inline: true,
        },
        { name: "Bot", value: member.user.bot ? "Yes" : "No", inline: true },
        {
          name: "Created At",
          value: member.user.createdAt.toUTCString(),
          inline: true,
        },
        {
          name: "Joined At",
          value: member.joinedAt.toUTCString(),
          inline: true,
        },
        {
          name: "Roles",
          value: member.roles.cache.map((r) => r).join(", "),
          inline: true,
        },
        {
          name: "Highest Role",
          value: `<@&${member.roles.highest.id}>`,
          inline: true,
        },
        {
          name: "Permissions",
          value: member.permissions.toArray().join(", "),
          inline: false,
        },
      ])
      .setColor("Random")
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  } catch (error) {
    console.log(error);
    return message.channel.send(`Something went wrong: ${error.message}`);
  }
};

exports.conf = {
  aliases: ["user"],
  cooldown: 10,
  location: __filename,
};

exports.help = {
  name: "userinfo",
  description: "Menampilkan informasi sebuah user.",
  usage: "userinfo",
  example: "userinfo",
};
