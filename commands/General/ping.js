const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args) => {
    const m = await message.reply('Pinging...');
    m.edit({
        content: 'Pong!',
        embeds: [
            new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Pong!')
                .addField('⌛ Latency', `**${m.createdTimestamp - message.createdTimestamp}ms**`)
                .addField('💓 API Latency', `**${Math.round(client.ws.ping)}ms**`)
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