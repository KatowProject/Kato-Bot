const discord = require('discord.js')
const db = require('quick.db')

module.exports = async (client, message) => {
    let afk = new db.table('AFKs'),
        authorstatus = await afk.fetch(message.author.id),
        mentioned = message.mentions.members.first();

    if (mentioned) {
        let status = await afk.get(`${mentioned.id}.alasan`);
        let waktu = await afk.get(`${mentioned.id}.time`)

        let msTos = Date.now() - waktu
        let since = client.util.parseDur(msTos)
        if (status) {
            message.reply(`**${mentioned.user.tag}** saat ini sedang AFK - **${since}** ago\n**Alasan:**\n\`\`\`${status}\`\`\` `, { disableMentions: 'all' }).then(
                d => d.delete({ timeout: 15000 })
            );
        }
    };

    if (authorstatus) {
        message.reply(`Kato telah mencabut status AFK mu!`).then(
            d => d.delete({ timeout: 10000 })
        )
        afk.delete(message.author.id)
    };
}