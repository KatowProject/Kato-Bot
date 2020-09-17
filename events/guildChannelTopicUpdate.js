let { MessageEmbed } = require('discord.js')
module.exports = async (client, channel, oldTopic, newTopic) => {
    let embed = new MessageEmbed()
        .setColor(client.warna.kato)
        .setTitle('Channel Topic')
        .setDescription(`Topik Channel ${channel} telah berubah!`)
        .addField('Sebelum', oldTopic)
        .addField('Sesudah', newTopic)
    return client.channels.cache.get('749212498514935868').send(embed)
}