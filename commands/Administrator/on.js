const Discord = require('discord.js');
const db = require('../../database').cmd;

exports.run = async (client, message, args) => {

    try {

        let request = args.join(' ');
        if (!request) return message.reply('berikan channelnya untuk melanjutkan');

        const userID = client.channels.cache.get(args[0]);
        const userRegex = new RegExp(args.join(" "), "i");

        let findChannel = client.channels.cache.find(a => {
            return userRegex.test(a.name);
        });

        const data = db.get('off');
        if (!data) db.set('off', []);

        if (userID) {
            const dataFilter = data.filter(ID => ID !== userID);
            if (!dataFilter) return message.reply('Gk ada Channel!');
            db.set('off', dataFilter);
            message.reply(`Semua perintah telah diaktifkan di <#${userID}>`)
        } else if (findChannel) {
            let dataFilter = data.filter(ID => ID !== findChannel.id);
            if (!dataFilter) return message.reply('Gk ada Channel!');
            db.set('off', dataFilter);
            message.reply(`Semua perintah telah diaktifkan di ${findChannel.name}`)
        };


    } catch (error) {
        return message.reply('sepertinya ada kesalahan:\n' + error.message);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['MANAGE_CHANNELS']
}

exports.help = {
    name: 'on',
    description: 'nyalain semua perintah dengan channel yang spesifik',
    usage: 'on <channelName / channelID>',
    example: 'on 795783129893568572'
}