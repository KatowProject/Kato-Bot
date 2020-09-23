const Discord = require('discord.js');
const Minesweeper = require('discord.js-minesweeper');
exports.run = async (client, message, args) => {
    try {
        let bantul = [
            "https://www.youtube.com/watch?v=8ptiSPeHlro",
            "https://cdn.discordapp.com/attachments/447408276628307969/731867966114889746/dBCXQ5Q.jpg",
            "https://media.discordapp.net/attachments/447408276628307969/731873590248472596/persiba.jpg?width=360&height=203",
            "https://cdn.discordapp.com/emojis/557919576910987274.png"
        ];
        let rstatus = Math.floor(Math.random() * bantul.length);

        message.channel.send(bantul[rstatus]);
    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    };
};

exports.conf = {
    aliases: ["vantul"],
    cooldown: 10
};

exports.help = {
    name: 'bantul',
    description: 'bantul',
    usage: 'k!bantul',
    example: 'k!bantul'
};