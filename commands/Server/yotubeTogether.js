const Discord = require('discord.js');
const { MessageButton } = require('discord-buttons');

exports.run = async (client, message, args) => {
    try {
        if (!message.member.voice.channel) return message.reply(':x: | You must be in a voice channel to use this command!');
        if (!message.member.voice.channel.name === 'Nobar') return message.reply('Only `Nobar` channel can be used');

        const joinButton = new MessageButton().setStyle('url').setLabel('Join').setURL('https://discord.gg/Xb6S9XkMmQ');
        message.channel.send('discord.gg/Xb6S9XkMmQ', joinButton);
    } catch (err) {
        console.log(err);
        message.reply(`There was an error running the command: \`${err}\``);
    }
}

exports.conf = {
    aliases: ['ytgd'],
    cooldown: 5,
    permissions: ['EMBED_LINKS'],
}

exports.help = {
    name: 'nobar',
    description: 'watch together with your friends',
    usage: 'youtubetogether',
    example: 'youtubetogether'
}