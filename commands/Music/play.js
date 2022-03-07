const { QueryType } = require("discord-player");

exports.run = async (client, message, args) => {
  if (!message.member.voice.channelId) return message.reply('Pastikan kamu telah bergabung dalam **Voice Channel**.', { ephemeral: true });
  if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.member.voice.channelId) return message.reply('Pastikan kamu bergabung dengan **Voice Channel** yang sama.', { ephemeral: true });

  const track = await client.player.search(args.join(' '), {
    requestedBy: message.author,
    searchEngine: QueryType.AUTO,
  });
  if (!track || !track.tracks.length) return message.reply('No results were found!');

  const queue = client.player.createQueue(message.guild, { metadata: message.channel });
  try {
    if (!queue.connection) await queue.connect(message.member.voice.channel);
  } catch {
    queue.destroy();
    return message.reply(`Tidak dapat bergabung ke Voice Channel.`);
  }

  track.playlist ? queue.addTracks(track.tracks) : queue.addTrack(track.tracks[0]);
  if (!queue.playing) await queue.play();
};

exports.conf = {
  aliases: ['p'],
  cooldown: 5,
  location: __filename
}

exports.help = {
  name: 'play',
  description: 'play a music',
  usage: 'play <query>',
  example: 'play sayonara'
}