const Discord = require('discord.js');
const { authBySessionId, getProfile } = require('scraper-instagram');
exports.run = async (client, message, args) => {

    try {

        await authBySessionId('2147862687%3ATKsQVzTbsS0RJf%3A21');
        getProfile('pos.total')
            .then(profile => console.log(profile))
            .catch(err => console.error(err));

    } catch (error) {
        console.log(error);
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual. 
    }
}

exports.conf = {
    aliases: ['insta', 'instagra', 'ig'],
    cooldown: 5
}

exports.help = {
    name: 'instagram',
    description: 'Menampilkan profile instagram',
    usage: 'instagram <url/username>',
    example: 'instagram pos.total'
}