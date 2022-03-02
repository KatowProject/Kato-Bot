const Discord = require("discord.js")
const fs = require("fs");

module.exports.run = async (client, message, args) => {

    if (!message.member.voice.channel) return message.channel.send({
        embed: {
            color: client.warna.error,
            description: `${client.emoji.error} | Kamu harus masuk Channel Voice terlebih dahulu!`
        }
    })

    await client.player.play(message, args.join(' '));



}

exports.conf = {
    aliases: ['search'],
    cooldown: 5
}

exports.help = {
    name: 'search',
    description: 'mencari lalu, memulai musik',
    usage: 'search <query>',
    example: 'search kato cantik'
}
