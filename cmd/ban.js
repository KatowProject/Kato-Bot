const Discord = require("discord.js");
const { Client, Message, RichEmbed } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

let xdemb = new Discord.RichEmbed()
.setColor("#00ff00")
.setTitle("Perintah BAN")
.addField("Penggunaan:", "k!ban [user] [reason]", true)
.addField("Contoh:" ,"k!ban @juned spam", true)

module.exports.run = async (client, message, args) => {
    let member = message.mentions.members.first();
    let reason = args.slice(1).join(" ") || "Tidak ada alasan";
    let author = message.guild.members.get(message.author.id);

    // Ketika tidak ada di mention
    if (!member)
        return message.reply(xdemb);

    // Ketika usernamenya sama ama yang di mention
    if (member.user.id === message.author.id)
        return message.reply('Anda tidak bisa membanned diri anda sendiri.');

    // Ketika yang membanned adalah member
    if (!author.hasPermission("ADMINISTRATOR") || !author.hasPermission("MANAGE_GUILD"))
        return message.reply('Anda adalah member biasa, anda tidak bisa menggunakan command ini!');

    // Ketika yang dibanned adalah admin/momod
    if (member.hasPermission("ADMINISTRATOR") || member.hasPermission("MANAGE_GUILD"))
        return message.reply('Anda tidak bisa membanned staff!');

    member.ban({ reason: reason })
        .then(banMember => {
            message.reply(`Anda berhasil membanned **${banMember.user.username}#${banMember.user.discriminator}** dengan alasan:\n${reason}`);
        })
        .catch(err => {
            message.reply(`Sepertinya ada masalah!\n\`\`\`${err.message}\`\`\``);
        });
}

module.exports.help = {
    name: "ban"
}