const Discord = require('discord.js');

exports.run = async (client, message, args) => {

  try {

    if (!message.member.voice.channel) return message.channel.send(`${client.emoji.error} | Kamu harus masuk Channel Voice terlebih dahulu!`)

    if (!client.player.isPlaying(message.guild.id)) return message.channel.send({
      embed: {
        color: client.warna.error,
        description: `${client.emoji.error} | There is nothing playing!`
      }
    })

    await client.player.pause(message);

    message.channel.send({
      embed: {
        color: client.warna.success,
        description: `${client.emoji.pause} | Dijedakan!`
      }
    })

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["jeda"],
  cooldown: 5
}

exports.help = {
  name: 'pause',
  description: 'menjeda musik',
  usage: 'k!pause',
  example: 'k!pause'
}