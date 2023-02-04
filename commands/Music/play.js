const { Client, Message } = require('discord.js');

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
    });
    try {
        if (!queue.connection) await queue.connect(message.member.voice.channel);

    } catch (err) {
        client.player.deleteQueue(message.guild);
        return message.reply(`There was an error connecting to the voice channel: ${err}`);
    }

    const track = await client.player.search(query, { requestedBy: message.author }).then(x => x.tracks[0]);
    if (!track) return message.reply('No results were found.');

    queue.addTrack(track);

    message.reply(`Loading your track \`${track.title}\`...`);

    queue.play();
}

exports.conf = {
    aliases: ['p'],
    cooldown: 5,
}

exports.help = {
    name: 'play',
    description: 'Play a song.',
    usage: 'play <query>',
    example: 'play Never gonna give you up'
}