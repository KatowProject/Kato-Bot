const Discord = require('discord.js');
const { QueryType } = require("discord-player");

exports.run = async (client, message, args) => {
    if (!message.member.voice.channelId) return message.reply('Pastikan kamu telah bergabung dalam **Voice Channel**.', { ephemeral: true });
    if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.member.voice.channelId) return message.reply('Pastikan kamu bergabung dengan **Voice Channel** yang sama.', { ephemeral: true });

    const queue = client.player.createQueue(message.guild, { metadata: message.channel });

    try {
        if (!queue.connection) await queue.connect(message.member.voice.channel);
    } catch {
        queue.destroy();
        return message.reply(`Tidak dapat bergabung ke Voice Channel.`)
    }

    const track = await client.player.search(args.join(' '), {
        requestedBy: message.author,
        searchEngine: QueryType.AUTO,
    });

    const playEmbed = new Discord.MessageEmbed()
        .setColor(`RANDOM`)
        .setTitle(
            `🎶 | New ${track.playlist ? "playlist" : "song"} Added to queue`
        );

    if (!track.playlist) {
        const tr = track.tracks[0];
        playEmbed.setThumbnail(tr.thumbnail);
        playEmbed.setDescription(`${tr.title}`);
    }

    if (!queue.playing) {
        track.playlist
            ? queue.addTracks(track.tracks)
            : queue.play(track.tracks[0]);
        return message.reply({ embeds: [playEmbed] });
    } else if (queue.playing) {
        track.playlist
            ? queue.addTracks(track.tracks)
            : queue.addTrack(track.tracks[0]);
        return message.reply({
            embeds: [playEmbed],
        });
    }
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