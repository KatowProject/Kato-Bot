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
            surrounding: true
        });

        message.channel.send("Surrounding telah diaktifkan!");
    } else
        //matikan efeknya
        if (off) {
            let channel = client.player.getQueue(message.guild.id)

            channel = client.player.setFilters(message.guild.id, {
                surrounding: false
            });

            message.channel.send('Surrounding telah dinonaktifkan!')
        };

}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'surrounding',
    description: 'menberikan efek surrounding pada musik',
    usage: 'k@surrounding <on/off>',
    example: 'k@surrounding on'
}
