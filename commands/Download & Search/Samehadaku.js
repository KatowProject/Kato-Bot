exports.run = async (client, message, args) => {
    try {
        let query = args.join('+');
        if (!query) return message.reply('jangan kosong!');

        await client.anime.samehadaku.getWithSearch(query, message);
    } catch (error) {
        message.channel.send('Something went wrong:\n' + error.message);
        // Restart the bot as usual. 
    }
}

exports.conf = {
    aliases: ['same'],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'samehadaku',
    description: 'same',
    usage: 'same <query>',
    example: 'same cat'
};