const { Client, Message, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');
const playdl = require('play-dl');
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 */
exports.run = async (client, message, args) => {
    if (!message.member.voice.channelId) return message.reply('You must be in a voice channel to use this command.');
    if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) return message.reply('You must be in the same voice channel as me to use this command.');

    const query = args.join(' ');
    if (!query) return message.reply('Please provide a search query.');

    const queue = client.player.createQueue(message.guild, {
        metadata: {
            channel: message.channel
        },
        bufferingTimeout: 1000,
        disableVolume: true,
        leaveOnEnd: true,
        leaveOnStop: true,
        spotifyBridge: true,
        async onBeforeCreateStream(track, source) {
            if (source === 'youtube') {
                const stream = await playdl.stream(track.url, { discordPlayerCompatibility: true });

                return stream.stream;
            }
        }
    });
    try {
        if (!queue.connection) await queue.connect(message.member.voice.channel);

    } catch (err) {
        queue.destroy();
        return message.reply(`There was an error connecting to the voice channel: ${err}`);
    }

    const results = await client.player.search(query, { requestedBy: message.author, searchEngine: QueryType.AUTO });
    const embed = new EmbedBuilder()
        .setTitle(`Search results for ${query}`)
        .setColor('Random')
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setDescription(results.tracks.map((t, i) => `**${i + 1}. [${t.title}](${t.url})**`).join('\n'))
        .setFooter({ text: 'Type the number of the song you want to play.' })
        .setTimestamp();

    const msg = await message.channel.send({ embeds: [embed] });

    let track = null;
    const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({ filter, time: 15000, max: 1, errors: ['time'] });
    collector.on('collect', async (m) => {
        const num = parseInt(m.content);
        if (isNaN(num) || num < 1 || num > 10) return message.reply('Invalid number.');

        track = results.tracks[num - 1];
        collector.stop();
        msg.delete();
    });

    collector.on('end', async (collected, reason) => {
        if (reason === 'time') {
            message.reply('You did not provide a number in time.');
            return msg.delete();
        }


        if (!queue.playing) {
            queue.addTrack(track);

            await queue.play();
            queue.playing = true;
            return message.reply(`Loading your track \`${track.title}\`...`);
        } else {
            queue.addTrack(track);
            return message.reply(`Added \`${track.title}\` to the queue!`);
        }
    });

}

exports.conf = {
    aliases: ['cari'],
    cooldown: 5,
}

exports.help = {
    name: 'search',
    description: 'Search for a song and add it to the queue.',
    usage: 'search <query>',
    example: 'search despacito'
}