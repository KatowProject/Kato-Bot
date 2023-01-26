const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 */
exports.run = async (client, message, args) => {
    const member = message.member;
    const roles = member._roles;

    const fps = '932997958738268252';
    const moba = '932997958738268253';
    const general = '932997958738268254';

    const embed = new EmbedBuilder().setColor('Random').setTitle('Self Roles').setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() }).setTimestamp();
    embed.addFields(
        { name: 'FPS', value: 'Mabar/mencari teman game First-person shooter' },
        { name: 'MOBA', value: 'Mabar/mencari teman game Multiplayer Online Battle Arena' },
        { name: 'General', value: 'Mabar/mencari teman game umum' }
    );

    for (const role of roles) {
        if (role === fps) embed.data.fields[0].name = 'FPS (Telah Terpasang)';
        if (role === moba) embed.data.fields[1].name = 'MOBA (Telah Terpasang)';
        if (role === general) embed.data.fields[2].name = 'General (Telah Terpasang)';
    };

    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('FPS 🔫').setStyle(ButtonStyle.Secondary).setCustomId(`fps-${message.id}`),
            new ButtonBuilder()
                .setLabel('MOBA 🏹').setStyle(ButtonStyle.Secondary).setCustomId(`moba-${message.id}`),
            new ButtonBuilder()
                .setLabel('General🧂').setStyle(ButtonStyle.Secondary).setCustomId(`general-${message.id}`)
        )

    const r = await message.channel.send({ embeds: [embed], components: [buttons] });
    const collector = r.channel.createMessageComponentCollector({ filter: m => m.user.id === message.author.id, time: 60000 });
    collector.on('collect', async (f) => {
        await f.deferUpdate();
        switch (f.customId) {
            case `fps-${message.id}`:
                if (roles.includes(fps)) {
                    member.roles.remove(fps);

                    embed.data.fields[0].name = 'FPS';
                    r.edit({ embeds: [embed] });

                    roles.splice(roles.indexOf(fps), 1);
                    message.reply('Telah dilepas!').then(a => setTimeout(() => a.delete(), 5000));
                } else {
                    member.roles.add(fps);

                    embed.data.fields[0].name = 'FPS (Telah Terpasang)';
                    r.edit({ embeds: [embed] });

                    roles.push(fps);
                    message.reply('Telah berhasil dipasang!').then(a => setTimeout(() => a.delete(), 5000));
                };
                break;

            case `moba-${message.id}`:
                if (roles.includes(moba)) {
                    member.roles.remove(moba);

                    embed.data.fields[1].name = 'MOBA'
                    r.edit({ embeds: [embed] });

                    roles.splice(roles.indexOf(moba), 1);
                    message.reply('Telah dilepas!').then(a => setTimeout(() => a.delete(), 5000));
                } else {
                    member.roles.add(moba);

                    embed.data.fields[1].name = 'MOBA (Telah Terpasang)';
                    r.edit({ embeds: [embed] });

                    roles.push(moba);
                    message.reply('Telah berhasil dipasang!').then(a => setTimeout(() => a.delete(), 5000));
                };
                break;

            case `general-${message.id}`:
                if (roles.includes(general)) {
                    member.roles.remove(general);

                    embed.data.fields[2].name = 'General';
                    r.edit({ embeds: [embed] });

                    roles.splice(roles.indexOf(general), 1);
                    message.reply('Telah dilepas!').then(a => setTimeout(() => a.delete(), 5000));
                } else {
                    member.roles.add(general);

                    embed.data.fields[2].name = 'General (Telah Terpasang)';
                    r.edit({ embeds: [embed] });

                    roles.push(general);
                    message.reply('Telah berhasil dipasang!').then(a => setTimeout(() => a.delete(), 5000));
                };
                break;
        }
    });
};

exports.conf = {
    aliases: ['sf'],
    cooldown: 5,
    permissions: [],
    location: __filename
};

exports.help = {
    name: 'selfroles',
    description: 'selfroles',
    usage: 'selfroles',
    example: 'selfroles'
};