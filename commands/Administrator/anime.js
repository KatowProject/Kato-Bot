const { Client, Message } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {*} args 
 */
exports.run = async (client, message, args) => {
    try {
        const id = args[0] || message.mentions.users.first()?.id;
        if (!id) return message.reply("Masukkan ID untuk melanjutkan!");

        const member = await message.guild.members.fetch({ user: id });
        if (!member) return message.reply("Member tidak ditemukan!");

        const role = message.guild.roles.cache.get('932997958738268256');

        member.roles.add(role);

        message.reply(`Berhasil menambahkan role ${role.name} ke ${member.user.tag}`);
    } catch (err) {
        console.log(err);
        message.reply(`Error: ${err}`);
    }
}

exports.conf = {
    aliases: ['addrole'],
    cooldown: 10
}

exports.help = {
    name: "web",
    description: "Menambahkan role Web Developer",
    usage: "web <id>",
    example: ['web 1234567890']
}