const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has('MANAGE_GUILD')) return;
    const getHistory = await client.trakteer.getHistory();

    let pagination = 1;
    const map = getHistory.map((a, i) => `**${a.tanggal}**\n\`${a.description}\` - **[${a.amount}] | [${a.balance}]**`);
    const chunk = client.util.chunk(map, 15);

    const embed = new Discord.MessageEmbed()
        .setColor('AQUA')
        .setTitle('History')
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(chunk[pagination - 1].join('\n'))
        .setFooter(`Page ${pagination} of ${chunk.length}`)

    const btn = [
        new Discord.MessageButton().setStyle('SECONDARY').setLabel('< Back').setCustomId(`back-${message.id}`),
        new Discord.MessageButton().setStyle('SECONDARY').setLabel('Next >').setCustomId(`next-${message.id}`)
    ];

    const r = await message.channel.send({ embeds: [embed], components: [new Discord.MessageActionRow().addComponents(btn)] });
    const collector = r.channel.createMessageComponentCollector({ filter: msg => msg.user.id === message.author.id, time: 60_000 });
    collector.on('collect', async msg => {
        await msg.deferUpdate();

        switch (msg.customId) {
            case `back-${message.id}`:
                if (pagination === 1) return;
                pagination--;
                embed.setDescription(chunk[pagination - 1].join('\n'));
                embed.setFooter(`Page ${pagination} of ${chunk.length}`);

                r.edit({ embeds: [embed], components: [new Discord.MessageActionRow().addComponents(btn)] });
                break;

            case `next-${message.id}`:
                if (pagination === chunk.length) return;
                pagination++;
                embed.setDescription(chunk[pagination - 1].join('\n'));
                embed.setFooter(`Page ${pagination} of ${chunk.length}`);

                r.edit({ embeds: [embed], components: [new Discord.MessageActionRow().addComponents(btn)] });
                break;
        }
    });


}

exports.conf = {
    cooldown: 5,
    aliases: [],
    location: __filename
}

exports.help = {
    name: 'kas',
    description: 'cek uang kas',
    usage: 'kas',
    example: 'kas'
}