let { MessageEmbed } = require('discord.js');
module.exports = async (client, channel, oldPermissions, newPermissions) => {
    let embed = new MessageEmbed()
        .setColor(client.warna.kato)
        .setTitle('Permission Update')
        .setDescription(`Channel ${channel}, telah mengalami perubahan permission!`)

    client.channels.cache.get('749212498514935868').send(embed)
} 