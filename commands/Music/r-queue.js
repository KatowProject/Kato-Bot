const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {

    if (!message.member.voice.channel) return message.channel.send({
      embed: {
        color: client.warna.error,
        description: `${client.emoji.error} | Kamu harus masuk Channel Voice terlebih dahulu!`
      }
    })

    if (!client.player.isPlaying(message)) return message.channel.send({
      embed: {
        color: client.warna.error,
        description: `${client.emoji.error} | Tidak ada musik yang diputar!`
      }
    })

    client.player.clearQueue(message);

    message.channel.send({
      embed: {
        color: client.warna.success,
        description: `${client.emoji.success} | Antrian Lagu telah dibersihkan!`
      }
    })

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["cq"],
  cooldown: 5
}

exports.help = {
  name: 'clear-queue',
  description: 'Menghapus antrian lagu',
  usage: 'clear-queue',
  example: 'clear-queue'
}