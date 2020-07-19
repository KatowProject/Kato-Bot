const discord = require('discord.js')
const db = require('quick.db')

module.exports = async (client, message) => {
    let afk = new db.table('AFKs'),
        authorstatus = await afk.fetch(message.author.id),
        mentioned = message.mentions.members.first();

    if (mentioned) {
        let status = await afk.fetch(mentioned.id);

        if (status) {
            message.reply(`**${mentioned.user.tag}** saat ini sedang AFK\nAlasan: ${status}`).then(
                d => d.delete({ timeout: 7000 })
            );
        }
    };

    if (authorstatus) {
        message.reply(`Kato telah mencabut status AFK mu!`).then(
            d => d.delete({ timeout: 7000 })
        )
        afk.delete(message.author.id)
    };
}