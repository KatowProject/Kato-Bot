  const Discord = require('discord.js');

  exports.run = async (client, message, args) => {
    try {
      if(!message.member.voice.channel) return message.channel.send({embed: {color: client.warna.error, description: `${client.emoji.error} | Kamu harus masuk Channel Voice terlebih dahulu!` }})
    
      let queue = client.player.getQueue(message.guild.id);

      if(!queue) return message.channel.send({embed: {color: client.warna.error, description: `${client.emoji.error} | Tidak ada musik yang diputar!` }})

      const q = queue.songs.map((song, i) => { 
        return `${i === 0 ? 'Current :' : `\n${i+1}`}- [${song.name}](${song.url}) : ${song.author}`
      }).join('\n');  
        message.channel.send({embed: {color: client.warna.success, description: `${client.emoji.queue} **|**${q}`}})
      } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
      }
  }

  exports.conf = {
    aliases: ['q'],
    cooldown: 5
  }

  exports.help = {
    name: 'queue',
    description: 'Melihat antrian lagu',
    usage: 'k!queue',
    example: 'k!queue'
  }