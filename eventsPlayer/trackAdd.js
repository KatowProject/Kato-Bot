const Discord = require('discord.js');

module.exports = async (client, queue, track) => {
    queue.metadata.send({
        embeds: [
            new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription(`✅ **|** [${track.title}](${track.url}) **Added to the queue!**\n\nDurasi: \`${track.duration}\`\nPermintaan: ${track.requestedBy}\nAuthor: \`${track.author}\``)
                .setThumbnail(track.thumbnail)
        ]
    });
}