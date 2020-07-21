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
    if (!args[0]) return;
    let on = args[0] === "on"
    let off = args[0] === "off"

    if (on) {
        let channel = client.player.getQueue(message.guild.id)

        channel = client.player.setFilters(message.guild.id, {
            '8D': true
        });

        message.channel.send("8D telah diaktifkan!");
    } else

        if (off) {
            let channel = client.player.getQueue(message.guild.id)

            channel = client.player.setFilters(message.guild.id, {
                '8D': false
            });

            message.channel.send('8D telah dinonaktifkan!')
        };

}

exports.conf = {
    aliases: ["bb"],
    cooldown: 5
}

exports.help = {
    name: '8d',
    description: 'memberi efek 8D pada musik',
    usage: 'k@8D <on/off>',
    example: 'k@8D on'
}
