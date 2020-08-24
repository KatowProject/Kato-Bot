const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        let query = args.join('-')
        if (!query) return message.reply('Permintaan gagal!').then(t => t.delete({ timeout: 5000 }))
        await client.manga.getDetail(query, message);


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
    name: 'info',
    description: 'Melihat Info Manga',
    usage: 'info <endpoint>',
    example: 'nhen <endpoint>'
}