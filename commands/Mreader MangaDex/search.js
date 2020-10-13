const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        let query = args.join(' ')
        if (!query) return message.reply(`jika kamu tidak menemukannya coba gunakan \`${client.config.discord.prefix[0]}msearch\` untuk mendapatkannya!`)
            .then(t => t.delete({ timeout: 5000 }))
        await client.mangadex.getInformation(query, 'GB', message)

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
    description: 'Search Manga with Global Language (English)',
    usage: 'msearch <query>',
    example: 'msearch <query>'
}