const Discord = require("discord.js");
const moment = require("moment");

module.exports.run = async (bot, message, args) => {
    let member = message.mentions.members.first() || message.member,
     user = member.user;
    var masuk = moment(message.guild.member(member).joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss");
    var join = moment(message.guild.member(member).createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss");
     const joinDiscord = moment(user.createdAt).format('llll');
     const joinServer = moment(user.joinedAt).format('llll');

    let embed = new Discord.RichEmbed()
    .setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL)
        .setDescription(`${user}`)
        .setColor(`RANDOM`)
        .setThumbnail(`${user.displayAvatarURL}`)
        .addField('Joined at:', `${masuk}`)
        .addField('Status:', user.presence.status, true)
        .addField('Roles:', member.roles.map(r => `${r}`).join(' | '), true)
        .addField('Joined Discord At:', `${join}`)
        .addField('Discriminator: ', message.author.discriminator)
        .setFooter(`ID: ${user.id}`)
        .setTimestamp();

    message.channel.send(embed);
}
module.exports.help = {
    name : "userinfo"
}