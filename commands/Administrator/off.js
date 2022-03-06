const db = require('../../database').cmd;

exports.run = async (client, message, args) => {
    try {
        const data = db.get(`${message.guild.id}`);
    } catch (error) {
        return message.reply('sepertinya ada kesalahan:\n' + error.message);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permission: ['MANAGE_CHANNELS']
}

exports.help = {
    name: 'off',
    description: 'tolak perintah bot dengan channel yang spesifik',
    usage: 'off <channelName / channelID>',
    example: 'off 795783129893568572'
}