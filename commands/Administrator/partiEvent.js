const Discord = require('discord.js');
const db = require('../../database/schema/eventParticipations');


exports.run = async (client, message, args) => {
    try {
        const user = await db.find({});
        if (user.length < 1) return message.reply('Tidak ada partisipan!');

        const mapUser = user.map((a, i) => `${i + 1}. <@${a.userID}> | ${a.realName} | ${a.songSelection}`);
        const chunk = client.util.chunk(mapUser, 10);

        let pagination = 1;
        const embed = new Discord.MessageEmbed().setColor(client.warna.kato).setAuthor(message.guild.name, message.guild.iconURL()).setTitle('Data Partisipan');
        embed.setDescription(chunk[pagination - 1]);
        embed.setFooter(`Page ${pagination} of ${chunk.length}`);

        const msgEmbed = await message.channel.send(embed);
        await msgEmbed.react('👈');
        await msgEmbed.react('♻');
        await msgEmbed.react('👉');

        const backwardsFilter = (reaction, user) =>
            reaction.emoji.name === `👈` && user.id === message.author.id;
        const deleteEmbed = (reaction, user) =>
            reaction.emoji.name === `♻` && user.id === message.author.id;
        const forwardsFilter = (reaction, user) =>
            reaction.emoji.name === `👉` && user.id === message.author.id;

        const backwards = msgEmbed.createReactionCollector(backwardsFilter);
        const embedDelete = msgEmbed.createReactionCollector(deleteEmbed);
        const forwards = msgEmbed.createReactionCollector(forwardsFilter);

        backwards.on('collect', (f) => {
            if (pagination === 1) return;
            pagination--;
            embed.setDescription(chunk[pagination - 1].join('\n'));
            msgEmbed.edit(embed);

        });

        embedDelete.on('collect', (f) => {
            msgEmbed.delete();
        });

        forwards.on('collect', (f) => {
            if (pagination == chunk.length) return;
            pagination++;
            embed.setDescription(chunk[pagination - 1].join('\n'));
            msgEmbed.edit(embed);
        });


    } catch (e) {
        message.reply('Something went wrong:\n' + e.message);
    }
}

exports.conf = {
    aliases: ["e"],
    cooldown: 1
}

exports.help = {
    name: 'partievent',
    description: 'lihat partisipan',
    usage: 'partievent',
    example: 'partievent'
}