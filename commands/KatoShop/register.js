const { Message, EmbedBuilder } = require("discord.js");
const Client = require("../../core/ClientBuilder");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {Array} args
 */
exports.run = async (client, message) => {
    const user = message.author;

    try {
        await client.katoShop.user.register(user);
        message.reply(`Berhasil terdaftar di Event Kato Shop, selamat mengikuti event ini!`);
    } catch (e) {
        message.reply(`Gagal mendaftar di Kato Shop, \`${e}\``);
    }
};

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename,
};

exports.help = {
    name: "register",
    description: "register kato shop",
    usage: "register",
    example: "register",
};
