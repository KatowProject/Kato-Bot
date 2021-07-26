const Discord = require('discord.js');
const { MessageButton } = require('discord-buttons');

exports.run = async (client, message, args) => {
    const member = message.guild.members.cache.get(message.author.id);
    const roles = [] = member.roles.cache.map(a => a[0]);

    const fps = '647779294298243082';
    const moba = '647779361738719249';
    const mobage = '868778296710672394';

    const embed = new Discord.MessageEmbed().setColor('RANDOM').setTitle('Self Roles').setAuthor(message.guild.name, message.guild.iconURL()).setTimestamp();
    embed.addField('FPS', 'Mabar First-person shooter');
    embed.addField('MOBA', 'Mabar Multiplayer Online Battle Arena');
    embed.addField('MOBAGE', 'Mabar game gacha');

    for (const role of roles) {
        if (role === fps) embed.fields[0].name = 'FPS (Telah Terpasang)';
        if (role === moba) embed.fields[1].name = 'MOBA (Telah Terpasang)';
        if (role === mobage) embed.fields[2].name = 'MOBAGE (Telah Terpasang)';
    };

    const fpsButton = new MessageButton().setStyle('grey').setLabel('FPS 🔫').setID('fpsID');
    const mobaButton = new MessageButton().setStyle('grey').setLabel('MOBA 🏹').setID('mobaID');
    const mobageButton = new MessageButton().setStyle('grey').setLabel('MOBAGE 🧂').setID('mobageID');

    const r = await message.channel.send({ embed, buttons: [fpsButton, mobaButton, mobageButton] });
    const collector = r.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 500000 });

    collector.on('collect', (f) => {
        f.reply.defer();
        switch (f.id) {
            case 'fpsID':
                if (roles.includes(fps)) {
                    member.roles.remove(fps);

                    embed.fields[0].name = 'FPS';
                    r.edit(embed);

                    roles.splice(roles.indexOf(fps), 1);
                    message.reply('Telah dilepas!').then(a => a.delete({ timeout: 5000 }));
                } else {
                    member.roles.add(fps);

                    embed.fields[0].name = 'FPS (Telah Terpasang)';
                    r.edit(embed);

                    roles.push(fps);
                    message.reply('Telah berhasil dipasang!').then(a => a.delete({ timeout: 5000 }));
                };
                break;

            case 'mobaID':
                if (roles.includes(moba)) {
                    member.roles.remove(moba);

                    embed.fields[1].name = 'MOBA'
                    r.edit(embed);

                    roles.splice(roles.indexOf(moba), 1);
                    message.reply('Telah dilepas!').then(a => a.delete({ timeout: 5000 }));
                } else {
                    member.roles.add(moba);

                    embed.fields[1].name = 'MOBA (Telah Terpasang)';
                    r.edit(embed);

                    roles.push(moba);
                    message.reply('Telah berhasil dipasang!').then(a => a.delete({ timeout: 5000 }));
                };
                break;

            case 'mobageID':
                if (roles.includes(mobage)) {
                    member.roles.remove(mobage);

                    embed.fields[2].name = 'MOBAGE';
                    r.edit(embed);

                    roles.splice(roles.indexOf(mobage), 1);
                    message.reply('Telah dilepas!').then(a => a.delete({ timeout: 5000 }));
                } else {
                    member.roles.add(mobage);

                    embed.fields[2].name = 'MOBAGE (Telah Terpasang)';
                    r.edit(embed);

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
    permissions: []
};

exports.help = {
    name: 'selfrole',
    description: 'selfroles',
    usage: 'selfrole',
    example: 'selfrole'
};