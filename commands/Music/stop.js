exports.run = async (client, message, args) => {
  if (!message.member.voice.channelId) return message.reply('Pastikan kamu telah bergabung dalam **Voice Channel**.', { ephemeral: true });
  if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.member.voice.channelId) return message.reply('Pastikan kamu bergabung dengan **Voice Channel** yang sama.');

  const queue = client.player.getQueue(message.guild.id);
  if (!queue || !queue.playing) return message.reply('Tidak ada lagu yang diputar.');
  queue.destroy();

  message.reply('Berhasil mematikan lagu.');
}

exports.conf = {
  cooldown: 5,
  aliases: [],
  location: __filename
}

exports.help = {
  name: 'stop',
  description: 'Mematikan lagu yang sedang diputar.',
  usage: 'stop',
  example: 'stop'
}