const Discord = require('discord.js');
const { allCommands } = require('../../database/schema/manageCommand');

exports.run = async (client, message, args) => {

    try {
        const channels = allCommands;
        let request = args.join(' ');
        if (!request) return message.reply('berikan channelnya untuk melanjutkan');

        const userID = client.channels.cache.get(args[0]);
        const userRegex = new RegExp(args.join(" "), "i");

        let findChannel = client.channels.cache.find(a => {
            return userRegex.test(a.name);
        });

        const channel = await channels.find({ guild: message.guild.id });
        if (channel.length > 0) {
            const chData = channel.find(a => a.guild === message.guild.id);

            if (userID) {
                await channels.findOneAndUpdate({ guild: message.guild.id }, { guild: message.guild.id, channels: chData.channels.concat(userID.id) });
                message.reply(`Semua perintah telah dinonaktifkan di <#${userID.id}>!`);
            } else if (findChannel) {
                await channels.findOneAndUpdate({ guild: message.guild.id }, { guild: message.guild.id, channels: chData.channels.concat(findChannel.id) });
                message.reply(`Semua perintah telah dinonaktifkan di <#${findChannel.id}>`);
            } else {
                message.reply('Channel tidak ditemukan!');
            }
        }

    } catch (error) {
        console.log(error)
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
    name: 'off',
    description: 'tolak perintah bot dengan channel yang spesifik',
    usage: 'off <channelName / channelID>',
    example: 'off 795783129893568572'
}