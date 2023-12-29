const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const gis = require('g-i-s');

exports.run = async (client, message, args) => {
    try {
        gis(args.join(' '), async (err, res) => {
            if (err) message.reply(`Error: ${err}`);
            let pagination = 1;
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`Result for ${args.join(' ')}`)
                .setFooter({ text: `Page ${pagination} of ${res.length}` })
                .setImage(res[pagination - 1].url);

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('< Back')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(args[0] + 'back' + message.id),
                    new ButtonBuilder()
                        .setLabel('Next >')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(args[0] + 'next' + message.id)
                )

            const m = await message.channel.send({ embeds: [embed], components: [button] });
            const collector = m.channel
                .createMessageComponentCollector({ filter: msg => msg.user.id === message.author.id, time: 60000 });
            collector.on('collect', async (i) => {
                switch (i.customId) {
                    case args[0] + 'back' + message.id:
                        if (pagination === 0) return;
                        pagination--;
                        embed.setImage(res[pagination - 1].url);
                        embed.setFooter({ text: `Page ${pagination} of ${res.length}` });
                        m.edit({ embeds: [embed], components: [button] });
                        break;
                    case args[0] + 'next' + message.id:
                        if (pagination === res.length) return;
                        pagination++;
                        embed.setImage(res[pagination - 1].url);
                        embed.setFooter({ text: `Page ${pagination} of ${res.length}` });
                        m.edit({ embeds: [embed], components: [button] });
                        break;
                };

                await i.deferUpdate();
            });
        });
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`js\n${err.stack}\n\`\`\``);
    }
};

exports.conf = {
    aliases: ['gis'],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'image',
    description: 'Search image from Google Image Search',
    usage: 'image <query>',
    example: 'image cat'
};