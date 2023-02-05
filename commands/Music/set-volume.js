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

        const volume = parseInt(args[0]);
        if (isNaN(volume)) return message.reply('Please enter a valid number.');
        if (volume < 0 || volume > 100) return message.reply('Please enter a number between 0 and 100.');
        if (queue.volume === volume) return message.reply(`The volume is already set to ${volume}.`);

        const v = queue.setVolume(volume);
        console.log(v);
        if (v) message.reply(`The volume has been set to ${volume}.`);
    } catch (err) {
        message.channel.send(`There was an error: ${err}`);
    }
}

exports.conf = {
    aliases: ['vol', 'volume'],
    cooldown: 5,
}

exports.help = {
    name: 'set-volume',
    description: 'Sets the volume of the queue.',
    usage: 'set-volume <number>',
    example: 'set-volume 50',
}