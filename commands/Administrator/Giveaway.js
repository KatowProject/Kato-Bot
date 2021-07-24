const Discord = require('discord.js');
const db = require('../../database/schema/Giveaway');
const ms = require('ms');

exports.run = async (client, message, args) => {
    try {
        const options = args[0];
        const query = args.slice(1);

        switch (options) {
            case 'create':
                const alertChannel = await message.reply('Choose a channel to send it');
                const awaitChannel = await message.channel.awaitMessages((m) => m.author.id === message.author.id, { max: 1, time: 100000, errors: ['time'] })

                const channel = awaitChannel.first().mentions.channels?.first();
                if (channel) {
                    await alertChannel.delete();
                } else {
                    return message.reply('Invalid channel');
                };

                const alertTime = await message.reply('Please enter a time\n**Format**: s (seconds), m (minutes), h (hours), d (days)');
                const awaitTime = await message.channel.awaitMessages((m) => m.author.id === message.author.id, { max: 1, time: 100000, errors: ['time'] });

                const time = ms(awaitTime.first().content);
                if (time) {
                    await alertTime.delete();
                } else {
                    return message.reply('Invalid Time');
                };

                const alertMessage = await message.reply('Please enter a message');
                const awaitMessage = await message.channel.awaitMessages((m) => m.author.id === message.author.id, { max: 1, time: 100000, errors: ['time'] });

                const messages = awaitMessage.first().content;
                if (messages) {
                    await alertMessage.delete();
                } else {
                    return message.reply('Invalid Message');
                };

                const alertRequire = await message.reply('Please enter a require');
                const awaitRequire = await message.channel.awaitMessages((m) => m.author.id === message.author.id, { max: 1, time: 100000, errors: ['time'] });

                const require = awaitRequire.first().content;
                if (require) {
                    await alertRequire.delete();
                } else {
                    return message.reply('Invalid Require');
                }

                const embed = new Discord.MessageEmbed()
                    .setColor(client.warna.kato)
                    .setTitle('Giveaway Event')
                    .setDescription(`${messages}`)
                    .addField('Time: ', client.util.parseDur(time))
                    .addField('Require: ', `${require} Tickets`)
                    .setFooter(`Created by ${message.author.tag}`);
                const msgGiveaway = await client.channels.cache.get(channel.id).send({ embed });
                await msgGiveaway.react('🎉');
                await db.create({ messageID: message.channel.lastMessageID, channelID: channel.id, now: Date.now(), entries: 0, timeout: time, tickets: require });

                break;
        }
    } catch (err) {
        console.log(err);
        return message.reply('Something went wrong:\n' + err.message);
    }
}


exports.conf = {
    aliases: [],
    cooldown: 120,
    permissions: ['MANAGE_SERVERS']
};

exports.help = {
    name: 'giveaway',
    description: 'Starts a giveaway.',
    usage: 'giveaway <giveaway message>',
    example: 'giveaway'
}