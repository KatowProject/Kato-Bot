const Discord = require("discord.js")

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
    const bb = client.player.getQueue(message.guild.id).filters.surrounding;
    if (!bb) {
        client.player.setFilters(message.guild.id, {
            surrounding: true
        });
        message.channel.send("Efek Surround telah diaktifkan!");
    } else {
        client.player.setFilters(message.guild.id, {
            surrounding: false
        });
        message.channel.send("Efek Surround telah dinonaktifkan!");
    };

}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'surround',
    description: 'menberikan efek surround pada musik',
    usage: 'surrounding',
    example: 'surrounding'
}
