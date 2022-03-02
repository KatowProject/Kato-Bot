const { MessageEmbed } = require("discord.js");
const axios = require('axios');

exports.run = async (client, message, args) => {
    try {
        const response = await axios.get('https://nekos.life/api/v2/img/slap');
        const hug = response.data;

        let member = message.mentions.members.first();
        if (!args[0]) return message.reply("mention seseorang untuk melanjutkan!");
        const embed = new MessageEmbed();

        if (message.author.id === member.user.id) {
            embed.setTitle('Kamu menampar diri sendiri 😳')
            embed.setColor('RANDOM')
            embed.setImage(hug.url)

            message.channel.send({ embeds: [embed] });
        } else {
            embed.setTitle(`${message.guild.members.cache.get(message.author.id).displayName} menampar ${message.guild.members.cache.get(member.user.id).displayName} (✿◡‿◡)`)
            embed.setColor('RANDOM')
            embed.setImage(hug.url)

            message.channel.send({ embeds: [embed] });
        };
    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ["tampar"],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'slap',
    description: 'reaksi',
    usage: 'k!slap <user>',
    example: 'k!slap @juned'
}