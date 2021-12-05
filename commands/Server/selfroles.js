const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    const member = message.guild.members.cache.get(message.author.id);
    const roles = [] = member.roles.cache.map(a => a[0]);

    const fps = '647779294298243082';
    const moba = '647779361738719249';
    const mobage = '868778296710672394';

    const embed = new Discord.MessageEmbed().setColor('RANDOM').setTitle('Self Roles').setAuthor(message.guild.name, message.guild.iconURL()).setTimestamp();
    embed.addField('FPS', 'Mabar/mencari teman game First-person shooter');
    embed.addField('MOBA', 'Mabar/mencari teman game Multiplayer Online Battle Arena');
    embed.addField('MOBAGE', 'Mabar/mencari teman anime dan gacha');

    for (const role of roles) {
        if (role === fps) embed.fields[0].name = 'FPS (Telah Terpasang)';
        if (role === moba) embed.fields[1].name = 'MOBA (Telah Terpasang)';
        if (role === mobage) embed.fields[2].name = 'MOBAGE (Telah Terpasang)';
    };

    const buttons = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setLabel('FPS 🔫').setStyle('SECONDARY').setCustomId(`fps-${message.id}`),
            new Discord.MessageButton()
                .setLabel('MOBA 🏹').setStyle('SECONDARY').setCustomId(`moba-${message.id}`),
            new Discord.MessageButton()
                .setLabel('MOBAGE 🧂').setStyle('SECONDARY').setCustomId(`mobage-${message.id}`)
        )

    const r = await message.channel.send({ embeds: [embed], components: [buttons] });
    const collector = r.channel.createMessageComponentCollector(m => m.author.id === message.author.id, { time: 60000 });
    collector.on('collect', async (f) => {
        await f.deferUpdate();
        switch (f.customId) {
            case `fps-${message.id}`:
                if (roles.includes(fps)) {
                    member.roles.remove(fps);

                    embed.fields[0].name = 'FPS';
                    r.edit({ embeds: [embed] });

                    roles.splice(roles.indexOf(fps), 1);
                    message.reply('Telah dilepas!').then(a => a.delete({ timeout: 5000 }));
                } else {
                    member.roles.add(fps);

                    embed.fields[0].name = 'FPS (Telah Terpasang)';
                    r.edit({ embeds: [embed] });

                    roles.push(fps);
                    message.reply('Telah berhasil dipasang!').then(a => a.delete({ timeout: 5000 }));
                };
                break;

            case `moba-${message.id}`:
                if (roles.includes(moba)) {
                    member.roles.remove(moba);

                    embed.fields[1].name = 'MOBA'
                    r.edit({ embeds: [embed] });

                    roles.splice(roles.indexOf(moba), 1);
                    message.reply('Telah dilepas!').then(a => a.delete({ timeout: 5000 }));
                } else {
                    member.roles.add(moba);

                    embed.fields[1].name = 'MOBA (Telah Terpasang)';
                    r.edit({ embeds: [embed] });

                    roles.push(moba);
                    message.reply('Telah berhasil dipasang!').then(a => a.delete({ timeout: 5000 }));
                };
                break;

            case `mobage-${message.id}`:
                if (roles.includes(mobage)) {
                    member.roles.remove(mobage);

                    embed.fields[2].name = 'MOBAGE';
                    r.edit({ embeds: [embed] });

                    roles.splice(roles.indexOf(mobage), 1);
                    message.reply('Telah dilepas!').then(a => a.delete({ timeout: 5000 }));
                } else {
                    member.roles.add(mobage);

                    embed.fields[2].name = 'MOBAGE (Telah Terpasang)';
                    r.edit({ embeds: [embed] });

                    roles.push(mobage);
                    message.reply('Telah berhasil dipasang!').then(a => a.delete({ timeout: 5000 }));
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