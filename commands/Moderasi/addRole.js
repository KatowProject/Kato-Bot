const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        const memberMention = message.mentions.members.first();
        const memberID = message.guild.members.cache.get(args[0]);
        const user = memberMention ? memberMention : memberID ? memberID : message.guild.members.cache.get(message.author.id);

        const query = args.slice(1).join(' ');
        const roles = query.split(',');

        for (const role of roles) {
            if (role.length < 1) continue;
            const name = role.trim();

            const roleID = message.guild.roles.cache.get(name);
            const findRole = message.guild.roles.cache.find(a => a.name.toLowerCase() === name.toLowerCase());
            const roleRegex = new RegExp(name, "i");
            const findRegex = message.guild.roles.cache.find(a => roleRegex.test(a.name) ? roleRegex.test(a.name) : null);

            if (roleID) {
                user.roles.add(roleID.id);
            } else if (findRole) {
                user.roles.add(findRole.id);
            } else if (findRegex) {
                user.roles.add(findRegex.id);
            } else continue;
        };
        message.reply('Telah berhasil terpasang!');
    } catch (err) {
        console.log(err);
        message.reply(`Something went wrong:\n${err.message}`);
    }


};

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['MANAGE_ROLES']
};

exports.help = {
    name: 'addrole',
    description: 'add role member',
    usage: 'addrole',
    example: 'addrole'
};