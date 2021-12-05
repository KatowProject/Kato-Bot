const Discord = require('discord.js');

module.exports = async (client, queue, track) => {
    queue.metadata.send({
        embeds: [
            new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription(`✅ **|** [${track.title}](${track.url}) **Added to the queue!** \n\n Durasi: \`${track.duration}\`\n\n Permintaan : ${track.requestedBy}\n\n Author: \`${track.author}\``)
                .setThumbnail(track.thumbnail)
        ]
    });
}