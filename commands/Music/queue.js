const { Client, Message } = require('discord.js');

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 */
exports.run = async (client, message, args) => {
    try {
        if (!message.member.voice.channel) return message.reply('You are not in a voice channel.');
        if (message.member.voice.channelId !== message.guild.members.me.voice.channelId) return message.reply('You are not in the same voice channel as the bot.');

        const queue = client.player.getQueue(message.guild);
        if (!queue) return message.reply('Track is not playing.');

        const now = queue.current;
        const timestamp = queue.getPlayerTimestamp();
        const tracks = queue.tracks.map((track, i) => `**${i + 1}. ${track.title}** [${track.duration}] \`${track.url}\` - Requested by: ${track.requestedBy.tag}`);
        const list = typeof tracks === 'object' ? tracks.join('\n') : 'No tracks in the queue.';

        message.channel.send(`**Now Playing:**\n**${now.title}** \`[${timestamp.current} - ${now.duration}]\` **- Requested by: ${now.requestedBy.tag}**\n[${now.url}]\n**Current Queue:**\n${list}`);
    } catch (err) {
        message.channel.send(`There was an error: ${err}`);
    }
}

exports.conf = {
    aliases: ['q'],
    cooldown: 5,
}

exports.help = {
    name: 'queue',
    description: 'Shows the current queue.',
    usage: 'queue',
    example: 'queue',
}