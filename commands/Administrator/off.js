const Discord = require('discord.js');
const db = require('../../database').cmd;

exports.run = async (client, message, args) => {

    try {

        let request = args.join(' ');
        if (!request) return message.reply('berikan channelnya untuk melanjutkan');

        const channelID = client.channels.cache.get(args[0]);
        const channelRegex = new RegExp(args.join(" "), "i");

        let findChannel = client.channels.cache.find(a => {
            return channelRegex.test(a.name);
        });

        const data = db.get('off');
        if (!data) db.set('off', []);

        if (channelID) {
            db.push('off', channelID.id);
            message.reply(`Semua perintah telah dinonaktifkan di <#${channelID}>`)
        } else {
            db.push('off', findChannel.id);
            message.reply(`Semua perintah telah dinonaktifkan di ${findChannel.name}`)
        };


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