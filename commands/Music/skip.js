const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {

    if (!message.member.voice.channel) return message.channel.send({
      embed: {
        color: client.warna.error,
        description: `${client.emoji.error} | Kamu harus masuk Channel Voice terlebih dahulu!`
      }
    });

    if (!client.player.isPlaying(message)) return message.channel.send({
      embed: {
        color: client.warna.error,
        description: `${client.emoji.error} | There is nothing playing!`
      }
    });

    let song = await client.player.skip(message);

    message.channel.send({
      embed: {
        color: client.warna.success,
        description: `${client.emoji.success} | Skipped:\n[${song.title}](${song.url})`
      }
    })
  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["s"],
  cooldown: 5
}

exports.help = {
  name: 'skip',
  description: 'melewatkan lagu yang diputar',
  usage: 'k!skip',
  example: 'k!skip'
}