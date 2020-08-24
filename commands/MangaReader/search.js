const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        let query = args.join(' ')
        if (query.length < 5) return message.reply('minimal 5 karakter untuk mencarinya!').then(t => t.delete({ timeout: 5000 }))
        await client.manga.getBySearch(query, message);

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
    name: 'msearch',
    description: 'mendapatkan data manga dengan metode pencarian',
    usage: 'msearch <query>',
    example: 'msearch <kanojo>'
}