const Discord = require('discord.js');
const dbDonatur = require('../../database/schema/Donatur');
const dbBooster = require('../../database/schema/Booster');

exports.run = async (client, message, args) => {
    try {
        let user;
        const roles = message.member.roles.cache;
        if (roles.hasAll('932997958788608044', '933117751264964609')) {
            user = await dbDonatur.findOne({ userID: message.author.id });
        } else if (roles.has('932997958788608044')) {
            user = await dbDonatur.findOne({ userID: message.author.id });
        } else if (roles.has('933117751264964609')) {
            user = await dbBooster.findOne({ userID: message.author.id });
        } else {
            return message.reply('Kamu bukan partisipan!');
        }

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