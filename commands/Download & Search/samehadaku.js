const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    try {
        let query = args.join(' ');
        if (!query) return message.reply('masukin dulu!');

        await client.samehadaku.getWithSearch(query, message);
    } catch (error) {
        return console.log(error);
        // Restart the bot as usual. 
    }
}

exports.conf = {
    aliases: ['same', 'samehada', 'hadaku'],
    cooldown: 60
}

exports.help = {
    name: 'samehadaku',
    description: 'download anime lewat discord',
    usage: 'samehadaku <query>',
    example: 'samehadkau <query>'
}