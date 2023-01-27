const { Client, Message, AttachmentBuilder } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 */

exports.run = async (client, message, args) => {
    try {
        const sticker = message.stickers.first();
        if (!sticker) return message.channel.send({ content: 'You must provide a sticker!' });

        const attachment = new AttachmentBuilder().setFile(sticker.url);
        message.channel.send({ files: [attachment] });
    } catch (err) {
        console.log(err);
        message.channel.send({ content: 'Something wrong with: ' + err.message });
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: "sticker",
    description: "Get sticker url.",
    usage: "sticker <sticker>",
    example: "sticker <sticker>"
}
