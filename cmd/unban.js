const Discord = require("discord.js");
const { Client, Message, RichEmbed } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */
module.exports.run = async (client, message, args) => {
    let member = args[0];
    let author = message.guild.members.get(message.author.id);

    // Ketika tidak ada ID
    if (!member)
        return message.reply('Anda tidak mencantumkan IDnya!');

    // Ketika yang mengunban adalah member
    if (!author.hasPermission("ADMINISTRATOR") || !author.hasPermission("MANAGE_GUILD"))
        return message.reply('Anda adalah member biasa, anda tidak bisa menggunakan command ini!');

    message.guild.unban(member)
        .then(member => {
            message.reply(`Anda berhasil melepas banned dari **${member.username}#${member.discriminator}**!`);
        })
        .catch(err => {
            message.reply(`Sepertinya ada masalah!\n\`\`\`${err.message}\`\`\``);
        });
}

module.exports.help = {
    name: "unban"
}