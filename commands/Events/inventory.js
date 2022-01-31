const Discord = require('discord.js');
const dbEvent = require('../../database/schema/event');

exports.run = async (client, message, args) => {
    try {
        const getUser = await dbEvent.findOne({ userID: message.author.id });
        if (!getUser) return message.reply('Kamu bukan partisipan!');

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setTitle('Inventory')
            .addField('Tickets', `${getUser.ticket}`)
            .setDescription(getUser.items.map(a => `**${a.name}** - ${a.used ? 'Used' : 'Not Used'}`).join('\n'));

        message.channel.send({ embeds: [embed] });
    } catch (err) {
        message.reply(`Something went wrong: ${err.message}`);

    }
};

exports.conf = {
    aliases: ['inv'],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'inventory',
    description: 'Inventory',
    usage: 'inventory',
    example: 'inventory'
}