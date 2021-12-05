exports.run = async (client, message, args) => {
    try {
        let query = args.join('+');
        if (!query) return message.reply('jangan kosong!');

        if (query.startsWith('https')) await client.anime.kusonime.getDetail(query.replace('https://kusonime.com/', ''), message);
        else await client.anime.kusonime.getWithSearch(query, message);
    } catch (error) {
        message.channel.send('Something went wrong:\n' + error.message);
        // Restart the bot as usual. 
    }
}

exports.conf = {
    aliases: ['kuso'],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'kusonime',
    description: 'kusonime',
    usage: 'kusonime <query>',
    example: 'image cat'
};