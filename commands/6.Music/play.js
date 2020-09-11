const Discord = require('discord.js')
const moment = require('moment');

exports.run = async (client, message, args) => {
  if (client.config.channel.includes(message.channel.id)) return;
  try {

    if (!message.member.voice.channel) return message.channel.send({
      embed: {
        color: client.warna.error,
        description: `${client.emoji.error} | Kamu harus masuk Channel Voice terlebih dahulu!`
      }
    })

    //Permintaan Lagu dan Nama Permintaan
    let requestedBy = `\`${client.users.cache.get(message.author.id).tag}\`` || message.author
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
          description: `${client.emoji.success} **|** [${song.name}](${song.url}) **Added to the queue!** \n\n Durasi: \`${song.duration}\`\n\n Permintaan : ${song.requestedBy}\n\n Author: \`${song.author}\``,
          thumbnail: { url: song.thumbnail.replace('hqdefault', 'maxresdefault') }
        }
      });

    } else {
      // Else, play the song
      const song = await client.player.play(message.member.voice.channel, queue, requestedBy);

      if (song.type === 'playlist') {
        message.channel.send({
          embed: {
            color: client.warna.success,
            description: `**Menambahkan ${song.tracks.length} lagu ke dalam antrian!**\n
                          ${client.emoji.music} | Current Playing:\n${song.tracks[0].name}`,
            thumbnail: {
              url: song.tracks[0].thumbnail
            }
          }
        })
      } else {

        message.channel.send({
          embed: {
            color: client.warna.success,
            description: `${client.emoji.music} | Now Playing : \n [${song.name}](${song.url})\n \nDurasi : \`${song.duration}\`\n \nPermintaan : ${song.requestedBy}`,
            thumbnail: { url: song.thumbnail.replace('hqdefault', 'maxresdefault') }
          }
        })
      }

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
                  url: oldTrack.thumbnail.replace('hqdefault', 'maxresdefault')
                }
              }
            });

          } else {
            message.channel.send({
              embed: {
                color: client.warna.success,
                description: `${client.emoji.music} | Now Playing : \n [${newTrack.name}](${newTrack.url})\n \nDurasi : ${newTrack.duration}\n \nPermintaan : ${newTrack.requestedBy}`,
                thumbnail: newTrack.thumbnail.replace('hqdefault', 'maxresdefault')
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