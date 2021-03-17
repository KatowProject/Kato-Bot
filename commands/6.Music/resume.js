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
        description: `${client.emoji.error} | tidak ada musik yang diputar!`
      }
    });

    let song = await client.player.resume(message);

    message.channel.send({
      embed: {
        color: client.warna.success,
        description: `${client.emoji.resume} | Dilanjutkan!`
      }
    });
  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ['r'],
  cooldown: 5
}

exports.help = {
  name: 'resume',
  description: 'melanjutkan musik yang dijeda',
  usage: 'k!resume',
  example: 'k!resume'
}