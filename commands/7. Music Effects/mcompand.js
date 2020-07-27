const Discord = require("discord.js")
const fs = require("fs")

module.exports.run = async (client, message, args) => {

    if (!message.member.voice.channel) return message.channel.send({
        embed: {
            color: client.warna.error,
            description: `${client.emoji.error} | Kamu harus memasuki *Voice Channel* terlebih dahulu!`
        }
    })

    if (!client.player.isPlaying(message.guild.id)) return message.channel.send({
        embed: {
            color: client.warna.error,
            description: `${client.emoji.error} | Tidak ada musik yang diputar!`
        }
    })

    const bb = client.player.getQueue(message.guild.id).filters.mcompand;
    if (!bb) {
        client.player.setFilters(message.guild.id, {
            mcompand: true
        });
        message.channel.send("Efek Mcompand telah diaktifkan!");
    } else {
        client.player.setFilters(message.guild.id, {
            mcompand: false
        });
        message.channel.send("Efek Mcompand telah dinonaktifkan!");
    }

}

exports.conf = {
    aliases: ["bb"],
    cooldown: 5
}

exports.help = {
    name: 'mcompand',
    description: 'memberi efek mcompand pada musik',
    usage: 'mcompand [<true/false>]',
    example: 'mcompand'
}
