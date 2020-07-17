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
    if (!args[0]) return;
    let on = args[0] === "on"
    let off = args[0] === "off"


    //mulai efeknya
    if (on) {
        let channel = client.player.getQueue(message.guild.id)

        channel = client.player.setFilters(message.guild.id, {
            treble: true
        });

        message.channel.send("Treble telah diaktifkan!");
    } else
        //matikan efeknya
        if (off) {
            let channel = client.player.getQueue(message.guild.id)

            channel = client.player.setFilters(message.guild.id, {
                treble: false
            });

            message.channel.send('Treble telah dinonaktifkan!')
        };

}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'treble',
    description: 'menberikan efek treble pada musik',
    usage: 'k@treble <on/off>',
    example: 'k@treble on'
}
