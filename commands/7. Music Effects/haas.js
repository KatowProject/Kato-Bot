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

    const bb = client.player.getQueue(message.guild.id).filters.haas;
    if (!bb) {
        client.player.setFilters(message.guild.id, {
            haas: true
        });
        message.channel.send("Efek Haas telah diaktifkan!");
    } else {
        client.player.setFilters(message.guild.id, {
            haas: false
        });
        message.channel.send("Efek Haas telah dinonaktifkan!");
    }

}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'haas',
    description: 'memberi efek haas pada musik',
    usage: 'haas [<true/false>]',
    example: 'haas'
}
