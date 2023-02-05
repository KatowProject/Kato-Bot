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
        if (!queue.connection.paused) return message.reply('Track is already playing.');

        const resume = queue.setPaused(false);
        if (resume) message.reply('The Track has been resumed.');
    } catch (err) {
        message.channel.send(`There was an error: ${err}`);
    }
}

exports.conf = {
    aliases: ['rs'],
    cooldown: 5,
}

exports.help = {
    name: 'resume',
    description: 'resumes the current track.',
    usage: 'resume',
    example: 'resume',
}