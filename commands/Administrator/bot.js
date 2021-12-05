const Discord = require('discord.js');
const { allCommands } = require('../../database/schema/manageCommand');

exports.run = async (client, message, args) => {
    try {
        const option = args[0];
        if (!option) return message.reply('pilih opsi terlebih dahulu! on / off');

        const request = args.slice(1).join(' ');
        if (!request) return message.reply("Masukkan Nama Channel / Id Channel untuk melanjutkan!");

        const channelMention = message.mentions.channels.first();
        const channelRegex = new RegExp(args.join(" "), "i");
        const findChannel = client.channels.cache.find(a => channelRegex.test(a.name) || (a.id === request || channelMention.id));
        if (!findChannel) return message.reply("Channel tidak ditemukan!");

        const getChannel = await allCommands.findOne({ guild: message.guild.id });
        if (getChannel.length == 0) return message.reply("Data tidak ditemukan!");
        switch (option) {
            case 'off':
                await allCommands.findOneAndUpdate({ guild: message.guild.id }, { channels: [...getChannel.channels, findChannel.id] });
                message.reply("Bot telah dinonaktifkan di " + findChannel.name);
                break;

            case 'on':
                console.log(getChannel.channels);
                await allCommands.findOneAndUpdate({ guild: message.guild.id }, { channels: getChannel.channels.filter(a => a !== findChannel.id) });
                message.reply("Bot telah diaktifkan di " + findChannel.name);
                break;

            default:
                message.reply("Opsi tidak ditemukan!");
                break;
        }
    } catch (err) {
        message.reply(`Error: ${err}`);
    }

}

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'bot',
    description: 'Mematikan semua perintah Bot',
    usage: 'bot',
    example: 'bot'
}