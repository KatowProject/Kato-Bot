const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        let query = args.join('-')
        if (!query) return message.reply(`Penggunaan \`${client.config.prefix}msearch <query>\``)
        await client.manga.getChapList(query, message);



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
    name: 'read',
    description: 'Menampilkan doujin secara acak',
    usage: 'nhen random',
    example: 'nhen random'
}