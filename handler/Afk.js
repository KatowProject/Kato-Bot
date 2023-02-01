module.exports = async (client, message) => {
    const db = client.db.afk;

    const authorstatus = await db.get(message.author.id)
    const mentioned = message.mentions.members.first();

    if (authorstatus) {
        message.reply(`Kato telah mencabut status AFK mu!`).then(
            d => setTimeout(() => d.delete(), 10000)
        )
        await db.delete(message.author.id);
    };

    if (mentioned) {
        const status = await db.get(`${mentioned.id}.alasan`);
        const waktu = await db.get(`${mentioned.id}.time`)

        const msTos = Date.now() - waktu;
        const since = client.util.parseDur(msTos);
        if (status) {
            message.reply(`**${mentioned.user.tag}** saat ini sedang AFK - **${since}** ago\n**Alasan:**\n\`\`\`${status}\`\`\` `, { disableMentions: 'all' }).then(
                d => setTimeout(() => d.delete(), 10000)
            );
        }
    };


}