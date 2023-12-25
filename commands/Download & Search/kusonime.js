exports.run = async (client, message, args) => {
    try {
        let query = args.join('+');
        if (!query) return message.reply('jangan kosong!');

        if (query.startsWith('https')) await client.kusonime.getDetail(query.replace('https://kusonime.com/', ''), message);
        else await client.kusonime.getWithSearch(query, message);
    } catch (error) {
        message.channel.send('Something went wrong:\n' + error.message);
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
    example: 'kusonime saekano'
};