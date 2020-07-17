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
            vaporwave: true
        });

        message.channel.send("Efek Vaporwave telah diaktifkan!");
    } else

        if (off) {
            let channel = client.player.getQueue(message.guild.id)

            channel = client.player.setFilters(message.guild.id, {
                vaporwave: false
            });

            message.channel.send('Efek Vaporwave telah dinonaktifkan!')
        };

}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'vaporwave',
    description: 'menberikan efek vaporwave pada musik',
    usage: 'k@vaporwave <on/off>',
    example: 'k@vaporwave on'
}
