const Discord = require('discord.js');
/*
const duration = (22400 * 10);
const res = {
    seconds: Math.floor((duration / 1000) % 60),
    minutes: Math.floor((duration / (1000 * 60)) % 60),
    hours: Math.floor((duration / (1000 * 60 * 60)))
};
console.log(res)

*/ 
exports.run = async (client, message, args) => {
  try {
    if(!message.member.voice.channel) return  message.channel.send({embed: {color: client.warna.error, description: `${client.emoji.error} | Kamu harus masuk Channel Voice terlebih dahulu!` }})

    if(!client.player.isPlaying(message.guild.id)) return message.channel.send({embed: {color: client.warna.error, description: `${client.emoji.error} | Tidak ada musik yang diputar!` }})

    let song = await client.player.nowPlaying(message.guild.id);
    const durasi = (`${song.duration}` * '10');
        const res = {
          seconds : Math.floor((durasi / '1000') % '60'),
          minutes : Math.floor((durasi / ('1000' * '60'))% '60'),
          hour    : Math.floor((durasi / ('1000' * '60' * '60')))
        }
        console.log(res)
    let embed = new Discord.MessageEmbed()
    .setThumbnail(song.thumbnail.replace("default.jpg", "maxresdefault.jpg"))
    .setColor(client.warna.success)
    .setDescription(`${client.emoji.music} | Now Playing: [${song.name}](${song.url})\n\n Durasi : ${res.hour} Jam ${res.minutes} Menit ${res.seconds} Detik\n\n Author : ${song.author}`)
    message.channel.send(embed)
    } catch (error) {
      return message.channel.send(`Something went wrong: ${error.message}`);
      // Restart the bot as usual.
    }
}

exports.conf = {
  aliases: ["np"],
  cooldown: 5
}

exports.help = {
  name: 'now-playing',
  description: 'melihat musik yang sedang diputar!',
  usage: 'k!np',
  example: 'k!np'
}