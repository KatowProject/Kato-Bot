const Discord = require('discord.js');
const db = require('../../database/schema/xp_player');

exports.run = async (client, message, args) => {
    require('../../handler/XP')();
    const getUser = await db.findOne({ id: 1 });

    const mapInfo = getUser.data.map((a, i) => `${i + 1}. <@${a.id}> | Level: ${a.level} | Message Count: ${a.message_count}`);
    const chunk = client.util.chunk(mapInfo, 20);

    let pagination = 1
    const embed = new Discord.MessageEmbed().setColor(client.warna.kato).setAuthor('Perkumpulan Orang Santai', message.guild.iconURL());
    embed.setDescription(chunk[pagination - 1].join('\n'));
    embed.setFooter(`Page ${pagination} of ${chunk.length}`);

    const embedMessage = await message.channel.send(embed);
    await embedMessage.react('👈');
    await embedMessage.react('♻');
    await embedMessage.react('👉');

    const backwardsFilter = (reaction, user) =>
        reaction.emoji.name === `👈` && user.id === message.author.id;
    const deleteEmbed = (reaction, user) =>
        reaction.emoji.name === `♻` && user.id === message.author.id;
    const forwardsFilter = (reaction, user) =>
        reaction.emoji.name === `👉` && user.id === message.author.id;

    const backwards = embedMessage.createReactionCollector(backwardsFilter);
    const embedDelete = embedMessage.createReactionCollector(deleteEmbed);
    const forwards = embedMessage.createReactionCollector(forwardsFilter);

    backwards.on('collect', (f) => {
        if (pagination === 1) return;
        pagination--;
        embed.setDescription(chunk[pagination - 1].join('\n'));
        embed.setFooter(`Page ${pagination} of ${chunk.length}`);
        embedMessage.edit(embed);

    });

    embedDelete.on('collect', (f) => {
        embedMessage.delete();
    });

    forwards.on('collect', (f) => {
        if (pagination == chunk.length) return;
        pagination++;
        embed.setDescription(chunk[pagination - 1].join('\n'));
        embed.setFooter(`Page ${pagination} of ${chunk.length}`);
        embedMessage.edit(embed);
    });

}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['MANAGE_MESSAGES']
}

exports.help = {
    name: 'xp-player',
    description: 'Check XP player',
    usage: 'xp-player',
    example: 'xp-player'
}