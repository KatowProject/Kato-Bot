const Discord = require('discord.js');
const db = require('../../database/schema/event');

exports.run = async (client, message, args) => {
    const getUser = await db.find({});
    if (!getUser || getUser.length < 1) return message.reply('Tidak ada partisipan!');

    const mapMsg = getUser.map((a, i) => `${i + 1}. <@${a.userID}> | Ticket: ${a.ticket}`);
    const chunk = client.util.chunk(mapMsg, 10);

    let pagination = 1;
    const embed = new Discord.MessageEmbed()
        .setColor(client.warna.kato)
        .setAuthor('Perkumpulan Orang Santai', message.guild.iconURL())
        .setDescription(chunk[pagination - 1].join('\n'))
        .setFooter(`Page ${pagination} of ${chunk.length}`);

    const embedMsg = await message.channel.send(embed);
    await embedMsg.react('👈');
    await embedMsg.react('♻');
    await embedMsg.react('👉');

    const backwardsFilter = (reaction, user) => reaction.emoji.name === `👈` && user.id === message.author.id;
    const deleteEmbed = (reaction, user) => reaction.emoji.name === `♻` && user.id === message.author.id;
    const forwardsFilter = (reaction, user) => reaction.emoji.name === `👉` && user.id === message.author.id;

    const backwards = embedMsg.createReactionCollector(backwardsFilter);
    const embedDelete = embedMsg.createReactionCollector(deleteEmbed);
    const forwards = embedMsg.createReactionCollector(forwardsFilter);

    backwards.on('collect', (f) => {
        if (pagination === 1) return;
        pagination--;
        embed.setDescription(chunk[pagination - 1].join('\n'));
        embed.setFooter(`Page ${pagination} of ${chunk.length}`);
        embedMsg.edit(embed);

    });

    embedDelete.on('collect', (f) => {
        embedMsg.delete();
    });

    forwards.on('collect', (f) => {
        if (pagination == chunk.length) return;
        pagination++;
        embed.setDescription(chunk[pagination - 1].join('\n'));
        embed.setFooter(`Page ${pagination} of ${chunk.length}`);
        embedMsg.edit(embed);
    });
}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'participation',
    description: 'partisipan',
    usage: 'participation',
    example: 'participation'
}