const Discord = require('discord.js');
const AFK = require('../database/schema/AFK');

module.exports = async (client, message) => {

    const mentioned = message.mentions.members.first();
    const author = await AFK.findOne({ userID: message.author.id });
    const member = message.guild.members.cache.get(message.author.id);

    if (mentioned) {
        const user = await AFK.findOne({ userID: mentioned.id });
        if (!user) return;

        const dataUser = JSON.parse(user.data);
        const waktu = dataUser.time;
        const alasan = dataUser.reason;

        const msLeft = Date.now() - waktu;
        const since = client.util.parseDur(msLeft);

        message.reply(`**${mentioned.user.tag}** saat ini sedang AFK - **${since} ago**\n**Alasan:**\n${alasan}`, { disableMentions: 'all' })
            .then(m => m.delete({ timeout: 15000 }));
    };

    if (author) {
        const nickname = member.nickname;
        if (nickname) {
            if (nickname.includes('[AFK]')) member.setNickname(nickname.replace('[AFK]', ''));
        }
        message.reply('Kato telah mencabut status AFK mu!').then(m => m.delete({ timeout: 10000 }));
        await AFK.findOneAndDelete({ userID: message.author.id });
    }

}