const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    if (!message.member.voice.channelId) return message.reply('Pastikan kamu telah bergabung dalam **Voice Channel**.');
    if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.member.voice.channelId) return message.reply('Pastikan kamu bergabung dengan **Voice Channel** yang sama.');

    const queue = client.player.getQueue(message.guild.id);
    if (!queue || !queue.playing) return message.reply('❌ | Tidak ada lagu yang diputar.');
    const songs = client.util.chunk(queue.tracks, 10);

    const embed = new MessageEmbed().setColor('RANDOM').setTitle('🎵 | Queue');
    songs.forEach((songs, i) => {
        embed.setDescription(`\`${i + 1}\` | ${songs.map(song => `[${song.title}](${song.url})`).join('\n')}`);
        message.channel.send({ embeds: [embed] });
    });
}

exports.conf = {
    cooldown: 5,
    aliases: [],
    location: __filename
}

exports.help = {
    name: 'queues',
    description: 'Shows the current queues',
    usage: 'queues',
    example: 'queues'
}