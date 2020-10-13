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
    if (client.config.discord.channels.includes(message.channel.id)) return;
    if (!message.member.voice.channel) return message.channel.send({
      embed: {
        color: client.warna.error,
        description: `${client.emoji.error} | Kamu harus masuk Channel Voice terlebih dahulu!`
      }
    });

    if (!client.player.isPlaying(message.guild.id)) return message.channel.send({
      embed: {
        color: client.warna.error,
        description: `${client.emoji.error} | Tidak ada musik yang diputar!`
      }
    });

    let song = await client.player.nowPlaying(message.guild.id);

    message.channel.send({
      embed: {
        color: client.warna.success,
        description: `${client.emoji.music} **| Now Playing:**\n[${song.name}](${song.url}) \n\nDurasi: \`${song.duration}\` \n\n${client.player.createProgressBar(message.guild.id)} \n\nAuthor: \`${song.author}\` \n\nPermintaan: ${song.requestedBy}`,
        image: {
          url: song.thumbnail.replace('hqdefault.jpg', 'maxresdefault.jpg')
        },
        thumbnail: {
          url: message.guild.iconURL({ size: 2048 })
        }
      }
    });

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