const { EmbedBuilder } = require('discord.js');
const { Client, Message } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 */
exports.run = async (client, message, args) => {
    const option = args[0]?.toLowerCase() || null;
    if (!message.member.permissions.has('ManageMessages')) return message.reply('Not Enough Permission!');

    switch (option) {
        case 'create':
            await client.giveaway.create(message);
            break;

        case 'reroll':
            await client.giveaway.reroll(message, args);
            break;

        case 'list':
            await client.giveaway.getData(message, args);
            break;

        case 'end':
            await client.giveaway.end(message, args);
            break;

        case 'delete':
            await client.giveaway.delete(message, args);
            break;

        default:
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Giveaway Command List')
                        .setDescription([
                            '```',
                            'create - Create a giveaway',
                            'reroll - Reroll a giveaway',
                            'list - List all giveaways',
                            'end - End a giveaway',
                            'delete - Delete a giveaway',
                            '```'
                        ].join('\n'))
                        .setColor('Random')
                        .setTimestamp()
                        .setFooter({ text: '© 2023 Perkumpulan Orang Santai', iconURL: client.user.displayAvatarURL({ forceStatic: true }) })
                        .toJSON()
                ]
            });
            break;
    }

};

exports.conf = {
    aliases: ['ga'],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'giveaway',
    description: 'giveaway',
    usage: 'giveaway',
    example: 'giveaway'
}