const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        client.katoShop.inventory(message);
    } catch (err) {
        message.channel.send({ content: 'Something wrong with: ' + err.message });
    }
}

exports.conf = {
    cooldown: 5,
    aliases: []
}

exports.help = {
    name: "e-inventory",
    description: "Menampilkan daftar item yang dimiliki.",
    usage: "event-inventory",
    example: "event-inventory"
}