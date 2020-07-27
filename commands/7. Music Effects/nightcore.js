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
    const bb = client.player.getQueue(message.guild.id).filters.nightcore;
    if (!bb) {
        client.player.setFilters(message.guild.id, {
            nightcore: true
        });
        message.channel.send("Efek Nightcore telah diaktifkan!");
    } else {
        client.player.setFilters(message.guild.id, {
            nightcore: false
        });
        message.channel.send("Efek Nightcore telah dinonaktifkan!");
    }

}

exports.conf = {
    aliases: ["nc"],
    cooldown: 5
}

exports.help = {
    name: 'nightcore',
    description: 'memberikan efek nightcore pada musik',
    usage: 'nightcore',
    example: 'nightcore'
}
