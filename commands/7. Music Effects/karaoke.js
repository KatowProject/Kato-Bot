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


    const bb = client.player.getQueue(message.guild.id).filters.karaoke;
    if (!bb) {
        client.player.setFilters(message.guild.id, {
            karaoke: true
        });
        message.channel.send("Efek Karaoke telah diaktifkan!");
    } else {
        client.player.setFilters(message.guild.id, {
            karaoke: false
        });
        message.channel.send("Efek Karaoke telah dinonaktifkan!");
    }

}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'karaoke',
    description: 'memberi efek karaoke pada musik',
    usage: 'k@karaoke <on/off>',
    example: 'k@karaoke on'
}
