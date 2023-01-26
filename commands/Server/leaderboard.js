const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../../database/schemas/Xp');

exports.run = async (client, message, args) => {
    try {
        const res = await db.findOne({});
        const data = res.data;

        const lb = data.map((a, i) => `${i + 1}. <@${a.id}> **[Level ${a.level} | ${a.xp} EXP]**`);
        const my = lb.find(a => a.includes(`<@${message.author.id}>`));
        const chunk = client.util.chunk(lb, 15);

        let pagination = 1;
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`Leaderboard ${message.guild.name}`)
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setDescription(chunk[pagination - 1].join('\n'))
            .addFields({ name: 'Posisi Kamu', value: my ? my : 'Not in the leaderboard', inline: true })
            .setFooter({ text: `Page ${pagination} of ${chunk.length}` });

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('< Back')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`back-lb-${message.id}`),
                new ButtonBuilder()
                    .setLabel('Next >')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`next-lb-${message.id}`),
                new ButtonBuilder()
                    .setLabel('🗑️')
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId(`clear-lb-${message.id}`)
            );

        const r = await message.channel.send({ embeds: [embed], components: [button] });
        const collector = r.channel.createMessageComponentCollector({ filter: m => m.user.id === message.author.id, time: 60000 });
        collector.on('collect', async (m) => {
            switch (m.customId) {
                case `back-lb-${message.id}`:
                    if (pagination === 1) return;
                    pagination--;
                    embed.setFooter({ text: `Page ${pagination} of ${chunk.length}` })
                    embed.setDescription(chunk[pagination - 1].join('\n'));

                    r.edit({ embeds: [embed], components: [button] });
                    break;

                case `next-lb-${message.id}`:
                    if (pagination === chunk.length) return;
                    pagination++;

                    embed.setFooter({ text: `Page ${pagination} of ${chunk.length}` })
                    embed.setDescription(chunk[pagination - 1].join('\n'));

                    r.edit({ embeds: [embed], components: [button] });
                    break;

                case `clear-lb-${message.id}`:
                    r.delete();
                    break;
            }

            await m.deferUpdate();
        });
    } catch (err) {
        message.channel.send(`Something Went Wrong:\n${err.message}`);
    }
};

exports.conf = {
    aliases: ['lb'],
    cooldown: '5',
    location: __filename
};

exports.help = {
    name: 'leaderboard',
    description: 'Shows the level players',
    usage: 'leaderboard',
    example: 'leaderboard',
};