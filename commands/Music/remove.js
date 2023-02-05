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

        const i = args[0] - 1;
        const track = queue.tracks[i];
        if (!track) return message.reply('Track not found.');

        const removed = queue.remove(i);
        if (removed) message.reply(`Removed ${track.title} from the queue.`);
    } catch (err) {
        message.channel.send(`There was an error: ${err}`);
    }
}

exports.conf = {
    aliases: ['rm'],
    cooldown: 5,
}

exports.help = {
    name: 'remove',
    description: 'removes a song from the queue.',
    usage: 'remove <song number>',
    example: 'remove 1',
}