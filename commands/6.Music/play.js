const Discord = require('discord.js')
const moment = require('moment');
const { result } = require('lodash');

exports.run = async (client, message, args) => {
  try {

    //Permintaan Lagu dan Nama Permintaan
    let requestedBy = client.users.cache.get(message.author.id)
    let queue = args.join(" ");

    if (!queue) return message.channel.send({
      embed: {
        color: client.warna.error,
        description: `${client.emoji.error} | Please enter a query to search!`
      }
    })

    let playing = client.player.isPlaying(message.guild.id)

    if (playing) {
      // Add the song to the queue 
      let song = await client.player.addToQueue(message.guild.id, queue, requestedBy);


      message.channel.send({
        embed: {
          color: client.warna.success,
          description: `${client.emoji.success} **|** [${song.name}](${song.url}) **Added to the queue!** \n\n Durasi: \`${song.duration}\`\n\n Permintaan : \`${song.requestedBy}\`\n\n Author: \`${song.author}\``,
          thumbnail: { url: song.thumbnail }
        }
      });

    } else {
      // Else, play the song
      const song = await client.player.play(message.member.voice.channel, queue, requestedBy);

      message.channel.send({
        embed: {
          color: client.warna.success,
          description: `${client.emoji.music} | Now Playing : \n [${song.name}](${song.url})\n \nDurasi : ${song.duration}\n \nPermintaan : ${song.requestedBy}`,
          thumbnail: { url: song.thumbnail }
        }
      })


      client.player.getQueue(message.guild.id)
        .on('end', () => {
          message.channel.send({
            embed: {
              color: client.warna.warning,
              description: `${client.emoji.warning} | Antrian telah selesai, tambahkan lagu lagi untuk memutar!`
            }
          })

        })

        .on('trackChanged', (oldTrack, newTrack, skipped, repeatMode) => {

          if (repeatMode) {

            message.channel.send({
              embed: {
                color: client.warna.success,
                description: `${client.emoji.music} |  Now Repeating : \n [${oldTrack.name}](${oldTrack.url})\n \nDurasi : ${oldTrack.duration}\n \nPermintaan : ${oldTrack.requestedBy}`,
                thumbnail: {
                  url: oldTrack.thumbnail
                }
              }
            });

          } else {
            message.channel.send({
              embed: {
                color: client.warna.success,
                description: `${client.emoji.music} | Now Playing : \n [${newTrack.name}](${newTrack.url})\n \nDurasi : ${newTrack.duration}\n \nPermintaan : ${newTrack.requestedBy}`,
                thumbnail: newTrack.thumbnail
              }
            })
          }
        });
    }
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
  usage: '',
  example: ''
}