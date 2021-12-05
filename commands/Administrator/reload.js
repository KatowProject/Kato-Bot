const Discord = require('discord.js');
const path = require('path');
exports.run = async (client, message, args) => {
    if (!message.member.permissions.has('ADMINISTRATOR')) return;
    if (!args[0]) return message.reply('Command Name Require!');
    try {
        const cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
        if (!cmd) return message.reply('Command Not Found!');

        const m = await message.channel.send('Reloading...');
        client.util.unloadCommand(path.join(cmd.conf.location));

        const splitPath = path.join(cmd.conf.location).split(path.sep);
        const category = splitPath[splitPath.length - 2];
        const prop = require(`${cmd.conf.location}`);

        client.commands.set(prop.help.name, prop);
        prop.conf.aliases.forEach(alias => {
            client.aliases.set(alias, prop.help.name);
        });
        client.helps.get(category).cmds.push(prop.help.name);
        m.edit({ content: 'Reloaded!' });
    } catch (e) {
        message.channel.send(`\`ERROR\` \`\`\`js\n${e.message}\n\`\`\``);
    }
}

exports.conf = {
    aliases: ["e"],
    cooldown: 1,
    location: __filename
}

exports.help = {
    name: 'reload',
    description: 'reload',
    usage: 'a',
    example: 'a'
}