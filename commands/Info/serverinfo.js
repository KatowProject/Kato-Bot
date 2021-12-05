const Discord = require('discord.js');
const moment = require('moment');
const dateformat = require('dateformat');

exports.run = async (client, message, args) => {
    let icon = message.guild.iconURL({ size: 4096 }); // Server Avatar

    // Members
    let offline = message.guild.members.cache.filter(m => m.presence?.status == "offline").size,
        online = message.guild.members.cache.filter(m => m.presence?.status == "online").size,
        idle = message.guild.members.cache.filter(m => m.presence?.status == "idle").size,
        dnd = message.guild.members.cache.filter(m => m.presence?.status == "dnd").size,
        robot = message.guild.members.cache.filter(m => m.user.bot).size,
        total = message.guild.memberCount;

    // Channels
    let channels = message.guild.channels;
    let text = channels.cache.filter(r => r.type === "GUILD_TEXT").size,
        vc = channels.cache.filter(r => r.type === "GUILD_VOICE").size,
        category = channels.cache.filter(r => r.type === "GUILD_CATEGORY").size,
        totalchan = channels.cache.size;

    // Date
    let x = Date.now() - message.guild.createdAt;
    let h = Math.floor(x / 86400000) // 86400000, 5 digits-zero.
    let created = dateformat(message.guild.createdAt); // Install "dateformat" first.

    const owner = await message.guild.fetchOwner();

    const embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTimestamp(new Date())
        .setThumbnail(icon)
        .setAuthor(message.guild.name, icon)
        .setDescription(`**ID:** ${message.guild.id}`)
        .addField("Date Created", `${created} \nsince **${h}** day(s)`, true)
        .addField("Owner", `**${owner.user.tag}** \n\`${owner.id}\``, true)
        .addField(`Members [${total}]`, `Online: ${online} \nIdle: ${idle} \nDND: ${dnd} \nOffline: ${offline} \nBots: ${robot}`, true)
        .addField(`Channels [${totalchan}]`, `Text: ${text} \nVoice: ${vc} \nCategory: ${category}`, true)
    message.channel.send({ embeds: [embed] });
}

exports.conf = {
    aliases: ["server"],
    cooldown: 10,
    location: __filename
}

exports.help = {
    name: 'serverinfo',
    description: 'Menampilkan informasi sebuah server.',
    usage: 'server',
    example: 'server'
}