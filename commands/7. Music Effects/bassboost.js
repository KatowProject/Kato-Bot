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

    const bb = client.player.getQueue(message.guild.id).filters.bassboost;
    if (!bb) {
        client.player.setFilters(message.guild.id, {
            bassboost: true
        });
        message.channel.send("Efek Bassboost telah diaktifkan!");
    } else {
        client.player.setFilters(message.guild.id, {
            bassboost: false
        });
        message.channel.send("Efek Bassboost telah dinonaktifkan!");
    }

}

exports.conf = {
    aliases: ["bb"],
    cooldown: 5
}

exports.help = {
    name: 'bassboost',
    description: 'memberi efek bassboost pada musik',
    usage: 'bassboost [<true/false>]',
    example: 'bassboost'
}
