const { Client, Message } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 */
exports.run = async (client, message, args) => {
    try {
        if (!message.member.voice.channel) return message.reply('You are not in a voice channel.');
        if (message.member.voice.channelId !== message.guild.members.me.voice.channelId) return message.reply('You are not in the same voice channel as the bot.');

        const queue = client.player.getQueue(message.guild);
        if (queue) await queue.destroy();

        message.guild.members.me.voice.disconnect();

        message.reply('Disconnected from the voice channel...');
    } catch (err) {
        message.channel.send(`There was an error: ${err}`);
    }
}

exports.conf = {
    aliases: ['dc'],
    cooldown: 5,
}

exports.help = {
    name: 'disconnect',
    description: 'Disconnects the bot from the voice channel.',
    usage: 'disconnect',
    example: 'disconnect',
}