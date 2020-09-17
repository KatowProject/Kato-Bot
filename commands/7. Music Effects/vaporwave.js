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


    const bb = client.player.getQueue(message.guild.id).filters.vaporwave;
    if (!bb) {
        client.player.setFilters(message.guild.id, {
            vaporwave: true
        });
        message.channel.send("Efek Vaporwave telah diaktifkan!");
    } else {
        client.player.setFilters(message.guild.id, {
            vaporwave: false
        });
        message.channel.send("Efek Vaporwave telah dinonaktifkan!");
    }

}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'vaporwave',
    description: 'menberikan efek vaporwave pada musik',
    usage: 'vaporwave',
    example: 'vaporwave'
}
