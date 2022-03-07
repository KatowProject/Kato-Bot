const { QueueRepeatMode } = require('discord-player');
const { MessageButton, MessageActionRow } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (!message.member.voice.channelId) return message.reply('Pastikan kamu telah bergabung dalam **Voice Channel**.', { ephemeral: true });
    if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.member.voice.channelId) return message.reply('Pastikan kamu bergabung dengan **Voice Channel** yang sama.', { ephemeral: true });

    const queue = client.player.getQueue(message.guild.id);
    if (!queue || !queue.playing) return message.reply('Tidak ada lagu yang diputar.');

    const btn = new MessageActionRow().addComponents([
      new MessageButton().setCustomId(`track-${message.id}`).setLabel('🎵 Track').setStyle('SECONDARY'),
      new MessageButton().setCustomId(`queue-${message.id}`).setLabel('🎶 Queue').setStyle('SECONDARY'),
      new MessageButton().setCustomId(`autoplay-${message.id}`).setLabel('🔁 Autoplay').setStyle('SECONDARY'),
      new MessageButton().setCustomId(`shuffle-${message.id}`).setLabel('❌ Off').setStyle('SECONDARY'),
    ]);

    const msg = await message.channel.send({ components: [btn] });

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["loop"],
  cooldown: 5
}

exports.help = {
  name: 'repeat',
  description: 'mengulang kembali lagu',
  usage: 'k!repeat',
  example: 'k!repeat'
}