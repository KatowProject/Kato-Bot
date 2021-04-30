let Discord = require('discord.js');

exports.run = async (client, message, args) => {


    try {

        if (!client.player.isPlaying(message)) return message.channel.send({
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

        await client.player.remove(message, parseInt(number));

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