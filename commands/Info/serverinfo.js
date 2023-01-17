const { Client, Message, EmbedBuilder, ChannelType, Collection, GuildMember } = require('discord.js');
const dateformat = require('dateformat');

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array} args 
 */

exports.run = async (client, message, args) => {
    const icon = message.guild.iconURL({ size: 4096, dynamic: true }); // Server Avatar

    const offline = message.guild.members.cache.filter(m => m.presence?.status == "offline").size,
        online = message.guild.members.cache.filter(m => m.presence?.status == "online").size,
        idle = message.guild.members.cache.filter(m => m.presence?.status == "idle").size,
        dnd = message.guild.members.cache.filter(m => m.presence?.status == "dnd").size,
        robot = message.guild.members.cache.filter(m => m.user.bot).size,
        total = message.guild.memberCount;

    // Channels
    const channels = message.guild.channels;
    const text = channels.cache.filter(r => r.type === ChannelType.GuildText).size,
        vc = channels.cache.filter(r => r.type === ChannelType.GuildVoice).size,
        category = channels.cache.filter(r => r.type === ChannelType.GuildCategory).size,
        forum = channels.cache.filter(r => r.type === ChannelType.GuildForum).size,
        thread = channels.cache.filter(r => r.type === ChannelType.PublicThread).size,
        totalchan = channels.cache.size;

    // Date
    const x = Date.now() - message.guild.createdAt;
    const h = Math.floor(x / 86400000) // 86400000, 5 digits-zero.
    const created = dateformat(message.guild.createdAt); // Install "dateformat" first.

    const owner = await message.guild.fetchOwner();

    const embed = new EmbedBuilder()
        .setColor('Random')
        .setTimestamp(new Date())
        .setThumbnail(icon)
        .setAuthor({ name: message.guild.name, iconURL: icon })
        .setDescription(`**ID:** ${message.guild.id}`)
        .addFields(
            { name: "Date Created", value: `${created} \nsince **${h}** day(s)`, inline: true },
            { name: "Owner", value: `**${owner.user.tag}** \n\`${owner.id}\``, inline: true },
            // newtab
            { name: "\u200b", value: "\u200b", inline: true },
            { name: `Members [${total}]`, value: `Online: ${online} \nIdle: ${idle} \nDND: ${dnd} \nOffline: ${offline} \nBots: ${robot}`, inline: true },
            { name: `Channels [${totalchan}]`, value: `Text: ${text} \nVoice: ${vc} \nCategory: ${category} \nForums: ${forum} \nThreads: ${thread}`, inline: true }
        )
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