const Discord = require("discord.js")
const fs = require("fs")

module.exports.run = async (client, message, args) => {

    //verif dulu
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

    //mainkan tombolnya sterrr
    const bb = client.player.getQueue(message.guild.id).filters.treble;
    if (!bb) {
        client.player.setFilters(message.guild.id, {
            treble: true
        });
        message.channel.send("Efek Treble telah diaktifkan!");
    } else {
        client.player.setFilters(message.guild.id, {
            treble: false
        });
        message.channel.send("Efek Treble telah dinonaktifkan!");
    }

}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'treble',
    description: 'menberikan efek treble pada musik',
    usage: 'treble',
    example: 'treble'
}
