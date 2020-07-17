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
            bassboost: true
        });

        message.channel.send("Bassboost telah diaktifkan!");
    } else

        if (off) {
            let channel = client.player.getQueue(message.guild.id)

            channel = client.player.setFilters(message.guild.id, {
                bassboost: false
            });

            message.channel.send('Bassboost telah dinonaktifkan!')
        };

}

exports.conf = {
    aliases: ["bb"],
    cooldown: 5
}

exports.help = {
    name: 'bassboost',
    description: 'memberi efek bassboost pada musik',
    usage: 'k@bassboost <on/off>',
    example: 'k@bassboost on'
}
