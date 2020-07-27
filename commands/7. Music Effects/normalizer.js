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
    const bb = client.player.getQueue(message.guild.id).filters.normalizer;
    if (!bb) {
        client.player.setFilters(message.guild.id, {
            normalizer: true
        });
        message.channel.send("Efek Normalizer telah diaktifkan!");
    } else {
        client.player.setFilters(message.guild.id, {
            normalizer: false
        });
        message.channel.send("Efek Normalizer telah dinonaktifkan!");
    }

}

exports.conf = {
    aliases: ["nm"],
    cooldown: 5
}

exports.help = {
    name: 'normalizer',
    description: 'memberikan efek normalizer pada musik',
    usage: 'normalizer',
    example: 'normalizer'
}
