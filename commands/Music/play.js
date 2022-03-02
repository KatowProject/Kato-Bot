const Discord = require('discord.js')
const moment = require('moment');

exports.run = async (client, message, args) => {

  try {

    const query = args.join(' ');
    if (!message.member.voice.channel) return message.channel.send({
      embed: {
        color: client.warna.error,
        description: `${client.emoji.error} | Kamu harus masuk Channel Voice terlebih dahulu!`
      }
    })

    if (!query) return message.channel.send({
      embed: {
        color: client.warna.error,
        description: `${client.emoji.error} | Please enter a query to search!`
      }
    })
    // Else, play the song
    await client.player.play(message, query, true);

  } catch (error) {
    return console.log(error)

    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["p"],
  cooldown: 5
}

exports.help = {
  name: 'play',
  description: 'memutarkan sebuah musik',
  usage: 'k!play',
  example: 'k!play '
}