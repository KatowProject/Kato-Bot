const db = require('../database');

module.exports = async (client, message) => {
    let afk = db.afk,
        authorstatus = await afk.fetch(message.author.id),
        mentioned = message.mentions.members.first();

    if (authorstatus) {
        message.reply(`Kato telah mencabut status AFK mu!`).then(
            d => setTimeout(() => d.delete(), 10000)
        )
        afk.delete(message.author.id);
    };

    if (mentioned) {
        let status = await afk.get(`${mentioned.id}.alasan`);
        let waktu = await afk.get(`${mentioned.id}.time`)

        let msTos = Date.now() - waktu;
        let since = client.util.parseDur(msTos);
        if (status) {
            message.reply(`**${mentioned.user.tag}** saat ini sedang AFK - **${since}** ago\n**Alasan:**\n\`\`\`${status}\`\`\` `, { disableMentions: 'all' }).then(
                d => setTimeout(() => d.delete(), 10000)
            );
        }
    };


}