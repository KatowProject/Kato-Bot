const { Util } = require('discord.js');

exports.run = async (client, message, args) => {
  try {

    if (!message.member.voice.channel) return message.channel.send({
      embed: {
        color: client.warna.error,
        description: `${client.emoji.error} | Kamu harus masuk Channel Voice terlebih dahulu!`
      }
    })

    let queue = client.player.getQueue(message);

    if (!queue) return message.channel.send({
      embed: {
        color: client.warna.error,
        description: `${client.emoji.error} | Tidak ada musik yang diputar!`
      }
    })

    const q = queue.tracks.map((track, i) => `${i + 1}. [${track.title}](${track.url}) (${track.duration}) - **${track.requestedBy}**`);

    let current = await client.player.nowPlaying(message);
    current = `▶ | **${current.title}** - **${current.author}** (${current.duration}) - [**${current.requestedBy}**]\n` || 'tidak ada antrian';
    current += q.join('\n')
    let chunks = client.util.splitEmbedDescription(current, "\n");
    let total = chunks.length;
    let first = chunks.shift();
    message.channel.send({
      embed: {
        title: `Antrian Lagu`,
        color: client.warna.success,
        description: `${first}`,
        footer: {
          text: `Page 1/${total}`
        },
        timestamp: new Date()
      }
    })
    chunks.forEach((c, i) => {

      message.channel.send({
        embed: {
          title: `Antrian Lagu`,
          color: client.warna.kato,
          description: c,
          footer: {
            text: `Page ${i + 2}/${total}`
          },
          timestamp: new Date()
        }
      });
    })

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