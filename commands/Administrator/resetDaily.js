const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    const msg = await message.reply('Mohon tunggu sebentar....');

    require('../../handler/resetDaily')(client, true);

    await msg.edit('Telah selesai direset!');
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['MANAGE_MESSAGES']
}

exports.help = {
    name: 'daily-reset',
    description: 'reset daily',
    usage: 'daily-reset',
    example: 'daily-reset'
}