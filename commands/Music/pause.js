exports.run = async (client, message, args) => {
    try {
        if (!message.member.voice.channelId) return message.reply('Pastikan kamu telah bergabung dalam **Voice Channel**.', { ephemeral: true });
        if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.member.voice.channelId) return message.reply('Pastikan kamu bergabung dengan **Voice Channel** yang sama.', { ephemeral: true });

        const queue = client.player.getQueue(message.guild.id);
        if (!queue?.playing) return message.reply('Tidak ada lagu yang diputar');

        const paused = queue.setPaused(true);
        if (paused) return message.reply('Berhasil menjeda lagu.');
    } catch (error) {
        message.reply(`Something went wrong: ${error.message}`);
    }
}

exports.conf = {
    cooldown: 5,
    aliases: [],
    location: __filename
}

exports.help = {
    name: 'pause',
    description: 'Menghentikan lagu yang sedang diputar.',
    usage: 'pause',
    example: 'pause'
}