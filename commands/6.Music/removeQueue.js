let Discord = require('discord.js');

exports.run = async (client, message, args) => {

    if (!client.config.discord.channels.includes(message.channel.id)) return;
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

        let number = parseInt(args[0]);
        if (!number) return message.channel.send({
            embed: {
                color: client.warna.error,
                description: `${client.emoji.error} | Masukkan Angkanya!`
            }
        })

        await client.player.remove(message.guild.id, number).then(() => {
            message.channel.send('Telah dihapus!');
        });
    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`).then(() => {
            console.error();
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