const Discord = require('discord.js')
const moment = require('moment')

exports.run = async (client, message, args) => {
  try {
    let queue = args.join(" ");
    if (!queue) return message.channel.send({embed: {color: client.warna.error, description: `${client.emoji.error} | Please enter a query to search!` }})
    let playing = client.player.isPlaying(message.guild.id)
    
    if(playing){
        // Add the song to the queue 
        let song = await client.player.addToQueue(message.guild.id, queue);
        
        var embed = new Discord.MessageEmbed()
        .setColor(client.warna.success)
        .setDescription(`${client.emoji.success} | [${song.name}](${song.url}) Telah ditambahkan ke Daftar antrian!`)
        .setThumbnail(`${song.thumbnail.replace("default.jpg","maxresdefault.jpg")}`)
        message.channel.send(embed)
    } else {
        // Else, play the song
        let song = await client.player.play(message.member.voice.channel, queue);
        const durasi = (`${song.duration}` * '10');
        const res = {
          seconds : Math.floor((durasi / '1000') % '60'),
          minutes : Math.floor((durasi / ('1000' * '60'))% '60'),
          hour    : Math.floor((durasi / ('1000' * '60' * '60')))
        }
        console.log(res)
        
        var embed = new Discord.MessageEmbed()
        .setColor(client.warna.success)
        .setDescription(`${client.emoji.music} | Now Playing : \n [${song.name}](${song.url})\n \nDurasi : ${res.hour} Jam ${res.minutes} Menit ${res.seconds} Detik\n \nPermintaan : ${client.users.cache.get(song.requestedBy)}`)
        .setThumbnail(`${song.thumbnail.replace("default.jpg","maxresdefault.jpg")}`)
        message.channel.send(embed)
        song.queue.on('end', () => {
        message.channel.send({embed: {color: client.warna.warning, description: `${client.emoji.warning} | Antrian telah selesai, tambahkan lagu lagi untuk memutar!` }})
        });
    
        song.queue.on('songChanged', (oldSong, newSong, skipped, repeatMode) => {
          
            if(repeatMode){
              const durasi = (`${song.duration}` * '10');
              const res = {
              seconds : Math.floor((durasi / '1000') % '60'),
              minutes : Math.floor((durasi / ('1000' * '60'))% '60'),
              hour    : Math.floor((durasi / ('1000' * '60' * '60')))
            }
              var embed = new Discord.MessageEmbed()
              .setColor(client.warna.success)
              .setDescription(`${client.emoji.music} |  Now Repeating : \n [${oldSong.name}](${oldSong.url})\n \nDurasi : ${res.hour} Jam ${res.minutes} Menit ${res.seconds} Detik\n \nPermintaan : ${oldSong.requestedBy}`)
              .setThumbnail(`${oldSong.thumbnail.replace("default.jpg","maxresdefault.jpg")}`)
                message.channel.send(embed)
            } else {
              const durasi = (`${song.duration}` * '10');
              const res = {
              seconds : Math.floor((durasi / '1000') % '60'),
              minutes : Math.floor((durasi / ('1000' * '60'))% '60'),
              hour    : Math.floor((durasi / ('1000' * '60' * '60')))
              }
               var embed = new Discord.MessageEmbed()
            .setColor(client.warna.success)
            .setDescription(`${client.emoji.music} | Now Playing : \n [${newSong.name}](${newSong.url})\n \nDurasi : ${res.hour} Jam ${res.minutes} Menit ${res.seconds} Detik\n \nPermintaan : ${newSong.requestedBy}`)
            .setThumbnail(`${newSong.thumbnail.replace("default.jpg","maxresdefault.jpg")}`)
                message.channel.send(embed)
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