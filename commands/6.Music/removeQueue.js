let Discord = require('discord.js');

exports.run = async (client, message, args) => {


    try {
        if (!message.member.voice.channel) return message.channel.send({
            embed: {
                color: client.warna.error,
                description: `${client.emoji.error} | Kamu harus masuk Channel Voice terlebih dahulu!`
            }
        });

        if (!client.player.isPlaying(message.guild.id)) return message.channel.send({
            embed: {
                color: client.warna.error,
                description: `${client.emoji.error} | Tidak ada musik yang diputar!`
            }
        });

        let number = args[0]
        if (!number) return message.channel.send({
            embed: {
                color: client.warna.error,
                description: `${client.emoji.error} | Masukkan Angkanya!`
            }
        })

        let GetQueue = client.player.queues.find(a => a.guildID === message.guild.id).tracks;
        let RemoveSong = GetQueue.indexOf(GetQueue[parseInt(number) - 1]);
        GetQueue.splice(RemoveSong, 1);

    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`).then(() => {
            console.log(error)
        });
    }
}


exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'remove',
    description: 'menghapus lagu',
    usage: 'remove <number>',
    example: 'remove 3'
}