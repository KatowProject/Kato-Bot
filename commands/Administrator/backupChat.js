const Discord = require('discord.js');
const db = require('../../database/schema/')

exports.run = async (client, message, args) => {
    try {

    } catch (err) {
        return message.reply(`Something Went Wrong:\n${err.message}`);
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['ADMINISTRATORS']
}

exports.help = {
    name: 'backup',
    description: 'backupchat',
    usage: 'backup',
    example: '1'
}