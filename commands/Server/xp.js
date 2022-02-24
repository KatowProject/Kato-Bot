const dbDonatur = require('../../database/schema/Donatur');
const dbBooster = require('../../database/schema/Booster');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

exports.run = async (client, message, args) => {
    const donatur = await dbDonatur.find({});

    //array item 15 -
    const getUserTag = (id) => message.guild.members.cache.get(id)?.user.tag;
    const sort = donatur.sort((a, b) => b.message.daily - a.message.daily);
    const map = sort.map((x, i) => `**${i + 1}.** \`${getUserTag(x.userID)} | ${x.userID}\` **[${x.message.daily} Message | ${(x.message.daily * 10) * 0.25} XP]**`);
    const chunk = client.util.chunk(map, 10);

    let pagination = 1;
    const embed = new MessageEmbed()
        .setTitle('XP Bonus List')
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setColor('#0099ff')
        .setDescription(chunk[pagination - 1].join('\n'))
        .setFooter(`Page ${pagination} of ${chunk.length}`);

    const btn = [
        new MessageButton()
            .setLabel('< Back').setStyle('SECONDARY').setCustomId(`back-${message.id}`),
        new MessageButton()
            .setLabel('🗑️').setStyle('DANGER').setCustomId(`delete-${message.id}`),
        new MessageButton()
            .setLabel('> Next').setStyle('SECONDARY').setCustomId(`next-${message.id}`),
    ]
    const m = await message.channel.send({ embeds: [embed], components: [new MessageActionRow().addComponents(btn)] });
    const collector = m.channel.createMessageComponentCollector({ filter: msg => msg.user.id === message.author.id, time: 60_000 });
    collector.on('collect', async (msg) => {
        await msg.deferUpdate();

        switch (msg.customId) {
            case `back-${message.id}`:
                if (pagination === 1) return;
                pagination--;
                embed.setDescription(chunk[pagination - 1].join('\n'));
                embed.setFooter(`Page ${pagination} of ${chunk.length}`);
                m.edit({ embeds: [embed], components: [new MessageActionRow().addComponents(btn)] });
                break;
            case `next-${message.id}`:
                if (pagination === chunk.length) return;
                pagination++;
                embed.setDescription(chunk[pagination - 1].join('\n'));
                embed.setFooter(`Page ${pagination} of ${chunk.length}`);
                m.edit({ embeds: [embed], components: [new MessageActionRow().addComponents(btn)] });
                break;
            case `delete-${message.id}`:
                await m.delete();
                break;
        }
    });
}

exports.conf = {
    cooldown: 5,
    aliases: ['bonus'],
    location: __filename
}

exports.help = {
    name: 'xp',
    description: 'List XP Bonus',
    usage: 'xp',
    example: 'xp'
}
