const { MessageAttachment } = require('discord.js');

exports.run = async (client, message, args) => {
    let link = args.slice(0).join(' ')
    let format = args.slice(1).join(' ')
    try {
        let gambar = new MessageAttachment(link, format)
        message.channel.send(gambar)
    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'linked',
    description: '',
    usage: '',
    example: ''
}