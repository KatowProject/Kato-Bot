const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        client.tempEvent.register(message);
    } catch (err) {
        message.channel.send({ content: 'Something wrong with: ' + err.message });
    }
}

exports.conf = {
    cooldown: 5,
    aliases: []
}

exports.help = {
    name: "event-register",
    description: "Register untuk event.",
    usage: "event-register",
    example: "event-register"
}