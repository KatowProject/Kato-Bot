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
        description: `${client.emoji.error} | tidak ada yang diputar!`
      }
    })

    let song = await client.player.stop(message);

    message.channel.send({
      embed: {
        color: client.warna.success,
        description: `${client.emoji.stop} | Diputuskan!`
      }
    })
  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["dc"],
  cooldown: 5
}

exports.help = {
  name: 'stop',
  description: 'menghentikan musik',
  usage: 'k!stop',
  example: 'k!stop'
}