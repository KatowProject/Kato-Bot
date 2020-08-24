const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        let query = args.join('-')
        if (!query) return message.reply(`jika kamu tidak menemukannya coba gunakan \`${client.config.prefix}msearch\` untuk mendapatkannya!`)
            .then(t => t.delete({ timeout: 5000 }))
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