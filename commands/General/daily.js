const Discord = require('discord.js');
const db = require('../../database/schema/event');

exports.run = async (client, message, args) => {

    const user = await db.findOne({ userID: message.author.id });
    if (!user) return message.reply('Kamu tidak terdaftar dalam event ini!');

    if (user.isAttend) return message.reply('Kamu sudah absen!');
    await db.findOneAndUpdate({ userID: message.author.id }, { ticket: user.ticket + 1, isAttend: true });
    message.reply('Absen telah berhasil!');

}

exports.conf = {
    aliases: ['login', 'absen'],
    cooldown: 5
};

exports.help = {
    name: 'daily',
    description: 'daily ticket',
    usage: 'daily',
    example: 'daily'
}