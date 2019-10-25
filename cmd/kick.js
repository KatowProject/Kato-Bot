const Discord = require("discord.js");
const { Client, Message, RichEmbed } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

module.exports.run = async (client, message, args) => {
    let member = message.mentions.members.first();
    let reason = args.slice(1).join(" ") || "Tidak ada alasan";
    let author = message.guild.members.get(message.author.id);

    // Ketika tidak ada di mention
    if (!member)
        return message.reply("Tag user yang ingin ditendang!");

    // Ketika usernamenya sama ama yang di mention
    if (member.user.id === message.author.id)
        return message.reply('Anda tidak bisa membanned diri anda sendiri.');

    // Ketika yang membanned adalah member
    if (!author.hasPermission("ADMINISTRATOR") || !author.hasPermission("MANAGE_GUILD"))
        return message.reply('Anda tidak memiliki Akses!');

    // Ketika yang dibanned adalah admin/momod
    if (member.hasPermission("ADMINISTRATOR") || member.hasPermission("MANAGE_GUILD"))
        return message.reply('Anda tidak bisa membanned staff!');

    member.kick({ reason: reason })
        .then(kickMember => {
            message.reply(`Anda berhasil membanned **${kickMember.user.username}#${kickMember.user.discriminator}** dengan alasan:\n${reason}`);
        })
        .catch(err => {
            message.reply(`Sepertinya ada masalah!\n\`\`\`${err.message}\`\`\``);
        });
    let embed = new RichEmbed()
    .setTitle(`Kick | ${member.user.username}#${member.user.discriminator}`)
    .setColor("#RANDOM")
    .addField("User", member , true)
    .addField("Moderator", message.author, true)
    .addField("Alasan", reason, true)
    .setTimestamp()
    .setFooter(`${message.member.id}`, message.guild.iconURL)

    let channel = message.guild.channels.find(c => c.name === "mod-logs");
  if (!channel) return message.reply("Please create a incidents channel first!");
  channel.send(embed);

    }
module.exports.help = {
    name: "kick"
}
