const Discord = require('discord.js');
const axios = require('axios');
const genres = require('../../config/nekoslifes-nsfw.json');

exports.run = async (client, message, args) => {
    try {
        if (!message.channel.nsfw) return;
        const keys = genres.map(g => g.name);
        if (!args[0]) return message.channel.send('Please specify a genre.\nAvailable genres: ' + keys.join(', '));

        const genre = genres.find(g => g.name.toLowerCase() === args[0].toLowerCase());
        if (!genre) return message.channel.send('That is not a valid genre.');

        const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
        let uri = null;
        if (typeof genre.url === 'object') uri = random(genre.url);
        else uri = genre.url;

        const res = await axios.get(uri);
        const embed = new Discord.MessageEmbed()
            .setTitle("(❁´◡`❁)")
            .setColor('#985ce7')
            .setImage(res.data.url)

        message.channel.send({ embeds: [embed] });
    } catch (err) {
        console.log(err);
        message.channel.send(`Something went wrong: ${err.message}`);
    }
}

exports.conf = {
    aliases: ["anime"],
    cooldown: 1
}

exports.help = {
    name: '2d',
    description: 'Gets a NSFW URL of 2d(anime) image/gif',
    usage: 'k!2d',
    example: 'k!2d'
}