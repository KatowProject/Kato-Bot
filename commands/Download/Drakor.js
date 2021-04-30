const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    try {
        let query = args.join(' ');
        if (!query) return message.reply('masukin dulu!');

        if (query.startsWith('https')) await client.drakor.getDrakor(query.replace('https://ratudrakor.net/', ''), message);
        else await client.drakor.getBySearch(query, message);
    } catch (error) {
        return console.log(error);
        // Restart the bot as usual. 
    }
}

exports.conf = {
    aliases: ['kuso', 'kusoni', 'kusonime'],
    cooldown: 60
}

exports.help = {
    name: 'drakor',
    description: 'download drakor',
    usage: 'drakor <query>',
    example: 'drakor <query>'
}