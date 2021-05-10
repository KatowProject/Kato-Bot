const Discord = require('discord.js');

module.exports = async (client, message) => {

    if (message.author.bot) return;

    const ghostTagRoles = message.mentions.roles;
    const ghostTagVictims = message.mentions.members;

    if (ghostTagRoles.size > 0 && ghostTagVictims.size > 0) {

        const embedAllCase = new Discord.MessageEmbed()
            .setTitle('Ghost Tag Role dan User')
            .setColor(client.warna.kato)
            .addField('Pelaku', message.author.tag)
            .addField('ID', message.author.id)
            .addField('Lokasi', `<#${message.channel.id}>`)
            .addField('Content', message.content)

        if (ghostTagRoles.has('336344173324009475') || ghostTagRoles.has('336409607767457797') || ghostTagRoles.has('716520343459856438')) return client.channels.cache.get('336877836680036352').send(embedAllCase);
        const channelAllCase = client.channels.cache.get("795778462018830336")?.send(embedAllCase);
        if (!channelAllCase) return;

    } else if (ghostTagRoles.size > 0) {

        const embedRolesCase = new Discord.MessageEmbed()
            .setTitle('Ghost Tag Role')
            .setColor(client.warna.kato)
            .addField('Pelaku', message.author.tag)
            .addField('ID', message.author.id)
            .addField('Lokasi', `<#${message.channel.id}>`)
            .addField('Content', message.content)

        if (ghostTagRoles.has('336344173324009475') || ghostTagRoles.has('336409607767457797') || ghostTagRoles.has('716520343459856438')) return client.channels.cache.get('336877836680036352').send(embedRolesCase);
        const channelRolesCase = client.channels.cache.get("795778462018830336")?.send(embedRolesCase);
        if (!channelRolesCase) return;

    } else {

        const embedUsersCase = new Discord.MessageEmbed()
            .setTitle('Ghost Tag User')
            .setColor(client.warna.kato)
            .addField('Pelaku', message.author.tag)
            .addField('ID', message.author.id)
            .addField('Lokasi', `<#${message.channel.id}>`)
            .addField('Content', message.content)

        const channelUsersCase = client.channels.cache.get("795778462018830336")?.send(embedUsersCase);
        if (!channelUsersCase) return;

    }

}