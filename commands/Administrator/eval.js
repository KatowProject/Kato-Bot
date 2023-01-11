const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
    if (message.author.id !== "458342161474387999")
        return message.reply('gk boleh nakal ya sayang');

    try {
        let codein = args.join(' ');
        if (!codein) return;

        let code = await new Promise((resolve, reject) => resolve(eval(codein)));

        if (typeof code !== 'string') code = require('util').inspect(code, { depth: 0 });
        if (code.length >= 4096) code = code.substr(0, 4000) + '...';

        let embed = new EmbedBuilder()
            .setAuthor({ name: 'Evaluation' })
            .setTitle('Output')
            .setColor("#b5ec8a")
            .setDescription(`\`\`\`js\n${code}\n\`\`\``)
        message.channel.send({ embeds: [embed] });
    } catch (e) {
        let embed = new EmbedBuilder()
            .setAuthor({ name: 'Evaluation' })
            .setTitle('Error')
            .setColor("#eb6162")
            .setDescription(`\`\`\`js\n${e}\n\`\`\``)
        message.channel.send({ embeds: [embed] });
    }
}

exports.conf = {
    aliases: ["e"],
    cooldown: 1,
    location: __filename
}

exports.help = {
    name: 'eval',
    description: 'owner only',
    usage: '',
    example: ''
}