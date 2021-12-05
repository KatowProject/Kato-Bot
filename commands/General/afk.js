const Discord = require('discord.js');
const AFK = require('../../database/schema/AFK');

exports.run = async (client, message, args) => {
    try {
        const afk = await AFK.findOne({ userID: message.author.id });
        const member = message.guild.members.cache.get(message.author.id);

        //ignore AFK
        let reason = args.join(' ');

        if (!afk) {
            const nickname = member.nickname ? member.nickname : member.user.username;
            if (!nickname.length > 26) member.setNickname(`[AFK] ${nickname}`);
            message.channel.send(`**${message.author.tag}** telah AFK! \n**Alasan:** ${reason ? reason : "AFK"}`, { disableMentions: 'all' });
            setTimeout(async () => {
                const data = { reason: reason ? reason : "AFK", time: Date.now() };
                await AFK.create({ userID: message.author.id, data: JSON.stringify(data) });

            }, 7000);
        } else {
            await AFK.findOneAndDelete({ userID: message.author.id });
        };
    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    };
};

exports.conf = {
    aliases: ["away"],
    cooldown: 10
}

exports.help = {
    name: 'afk',
    description: 'menambahkan status afk pada user',
    usage: 'k!avatar [mention/userid/server]',
    example: 'k!avatar @juned | k!avatar 458342161474387999 | k!avatar server'
}