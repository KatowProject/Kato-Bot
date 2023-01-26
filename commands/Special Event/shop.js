const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        client.katoShop.Shop.ShopList(message, args);
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
}

exports.conf = {
    cooldown: 5,
    aliases: []
}

exports.help = {
    name: "e-shop",
    description: "Menampilkan daftar item yang bisa dibeli.",
    usage: "shop",
    example: "shop"
}