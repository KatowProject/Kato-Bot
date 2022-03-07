const Discord = require('discord.js');

module.exports = async (client, queue, track) => {
    queue.metadata.send({
        embeds: [
            new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription(`✅ **|** [${track.title}](${track.url}) **Now Playing!**\n\n**Durasi**: \`${track.duration}\`\n**Permintaan:** ${track.requestedBy}\n**Author:** \`${track.author}\``)
                .setThumbnail(track.thumbnail)
        ]
    });
};