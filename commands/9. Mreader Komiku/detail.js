const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        let query = args.join('-')
        if (!query) return message.reply('Permintaan gagal!').then(t => t.delete({ timeout: 5000 }))
        await client.komiku.getDetail(query, message);


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
    name: 'kinfo',
    description: 'Melihat Info Manga',
    usage: 'kinfo <endpoint>',
    example: 'kinfo <endpoint>'
}