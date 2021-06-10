const Discord = require('discord.js');
const db = require('../../database').log;

exports.run = async (client, message, args) => {

    const data = db.get(message.guild.id);
    const logs = Object.keys(data);

    const option = args[0];
    if (!option || !logs.includes(option)) return message.reply(logs.join(', '))
    const channel = args[1];
    const getChannel = message.guild.channels.cache.get(channel) || message.mentions.channels.first();
    if (!getChannel) return message.reply('Channel tidak ditemukan!');

    switch (option) {
        case 'feedbacks':
            db.set(message.guild.id + '.feedbacks', getChannel.id);
            message.reply('Telah berhasil!');
            break;
        case 'ban':
            db.set(message.guild.id + '.ban', getChannel.id);
            message.reply('Telah berhasil!');
            break;
        case 'mute':
            db.set(message.guild.id + '.mute', getChannel.id);
            message.reply('Telah berhasil!');
            break;
        case 'elm':
            db.set(message.guild.id + '.elm', getChannel.id);
            message.reply('Telah berhasil!');
            break;
        case 'kick':
            db.set(message.guild.id + '.kick', getChannel.id);
            message.reply('Telah berhasil!');
            break;
    }


}

exports.conf = {
    aliases: ["e"],
    cooldown: 1
}

exports.help = {
    name: 'logs',
    description: 'Mengaktifkan Log',
    usage: 'k!logs',
    example: 'k!logs'
}