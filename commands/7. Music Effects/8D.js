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

    const bb = client.player.getQueue(message.guild.id).filters["8D"]
    if (!bb) {
        client.player.setFilters(message.guild.id, {
            '8D': true
        });
        message.channel.send("Efek 8D telah diaktifkan!");
    } else {
        client.player.setFilters(message.guild.id, {
            '8D': false
        });
        message.channel.send("Efek 8D telah dinonaktifkan!");
    }

}

exports.conf = {
    aliases: ["dd"],
    cooldown: 5
}

exports.help = {
    name: '8d',
    description: 'memberi efek 8D pada musik',
    usage: '8D',
    example: '8D'
}
