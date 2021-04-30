const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async (client, message, args) => {

    try {
        //verify
        if (!message.member.hasPermission('MANAGE_CHANNELS')) return;

        let request = args.join(' ');
        if(!request) return message.reply('berikan channelnya untuk melanjutkan');

        const userID = client.channels.cache.get(args[0]);
        const userRegex = new RegExp(args.join(" "), "i");

        let findChannel = client.channels.cache.find(a => {
          return userRegex.test(a.name);
        });
        
        let data = db.get('disableAllCommands');
        if (data === null) db.set('disableAllCommands', ['0']);

        if(userID) {
            let dataFilter = data.filter(ID => ID !== userID);
            db.set('disableAllCommands', dataFilter);
            message.reply(`Semua perintah telah diaktifkan di <#${userID}>`)
        } else if (findChannel) {
            let dataFilter = data.filter(ID => ID !== findChannel.id);
            db.set('disableAllCommands', dataFilter);
            message.reply(`Semua perintah telah diaktifkan di ${findChannel.name}`)
        };
        
   
    } catch (error) {
        return message.reply('sepertinya ada kesalahan:\n' + error.message);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'on',
    description: 'nyalain semua perintah dengan channel yang spesifik',
    usage: 'on <channelName / channelID>',
    example: 'on 795783129893568572'
}