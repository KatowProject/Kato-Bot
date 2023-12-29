const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
    const m = await message.reply('Pinging...');
    m.edit({
        content: 'Pong!',
        embeds: [
            new EmbedBuilder()
                .setColor('Random')
                .setTitle('Pong!')
                .addFields(
                    {
                        name: '⌛ Latency', value: `**${m.createdTimestamp - message.createdTimestamp}ms**`
                    },
                    {
                        name: '💓 API Latency', value: `**${Math.round(client.ws.ping)}ms**`
                    }
                )
                .setTimestamp()
        ]
    });
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'ping',
    description: 'Pings the bot.',
    usage: 'ping',
    example: 'ping',
}