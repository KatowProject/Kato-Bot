const Discord = require('discord.js');
const dbDonatur = require('../../database/schema/Donatur');

exports.run = async (client, message, args) => {
    try {
        const user = await dbDonatur.findOne({ userID: message.author.id });
        if (!user) return message.reply('Kamu bukan donatur!');

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setTitle('Inventory')
            .addField('Tickets', `${user.ticket}`)

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