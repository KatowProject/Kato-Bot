const { Client, Message } = require('discord.js');
/**
 * @param {Client} client
 * @param {Message} message
*/

exports.run = async (client, message, args) => {
    try {
        const option = args[0];
        client.trakteer.getCommand(message, args, option);
    } catch (error) {
        console.log(error);
        return message.reply('sepertinya ada kesalahan\n' + error.message)
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ['tr', 'trak'],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'trakteer',
    description: 'perintah trakteer',
    usage: 'trakteer',
    example: 'trakteer'
}