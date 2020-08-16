const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        let query = parseInt(args.join(' '));
        if (!query) return message.reply('Penggunaan \`k!populer <angka>\`')
        await client.manga.getPopular(query, message);

    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 10
}

exports.help = {
    name: 'popular',
    description: 'Menampilkan doujin secara acak',
    usage: 'nhen random',
    example: 'nhen random'
}