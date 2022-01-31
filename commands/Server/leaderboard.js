const Discord = require('discord.js');
const db = require('../../database/schema/xp_player');

exports.run = async (client, message, args) => {
    try {
        const res = await db.findOne({});
        const data = res.data;

        const lb = data.map((a, i) => `${i + 1}. <@${a.id}> **[Level ${a.level} | ${a.xp} EXP]**`);
        const my = lb.find(a => a.includes(`<@${message.author.id}>`));
        const chunk = client.util.chunk(lb, 15);

        let pagination = 1;
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Leaderboard')
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(chunk[pagination - 1].join('\n'))
            .addField('Posisi Kamu', my ? my : 'Not in the leaderboard', true)
            .setFooter(`Page ${pagination} of ${chunk.length}`);

        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('< Back')
                    .setStyle('SECONDARY')
                    .setCustomId(`back-lb-${message.id}`),
                new Discord.MessageButton()
                    .setLabel('Next >')
                    .setStyle('SECONDARY')
                    .setCustomId(`next-lb-${message.id}`),
                new Discord.MessageButton()
                    .setLabel('🗑️')
                    .setStyle('DANGER')
                    .setCustomId(`clear-lb-${message.id}`)
            );

        const r = await message.channel.send({ embeds: [embed], components: [button] });
        const collector = r.channel.createMessageComponentCollector({ filter: m => m.user.id === message.author.id, time: 60000 });
        collector.on('collect', async (m) => {
            switch (m.customId) {
                case `back-lb-${message.id}`:
                    if (pagination === 1) return;
                    pagination--;
                    embed.setFooter(`Page ${pagination} of ${chunk.length}`);
                    embed.setDescription(chunk[pagination - 1].join('\n'));

                    r.edit({ embeds: [embed], components: [button] });
                    break;

                case `next-lb-${message.id}`:
                    if (pagination === chunk.length) return;
                    pagination++;

                    embed.setFooter(`Page ${pagination} of ${chunk.length}`);
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