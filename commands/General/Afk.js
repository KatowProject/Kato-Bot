const { Client, Message } = require('discord.js');
const { QuickDB } = require('quick.db');
/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 */
exports.run = async (client, message, args) => {
    try {
        const db = client.db.afk;
        const afk = await db.get(message.author.id);
        const reason = args.join(' ');

        if (!afk) {
            message.channel.send(`**${message.author.tag}** telah AFK! \n**Alasan:** ${reason ? reason : "AFK"}`);
            setTimeout(async () => {
                await db.set(message.author.id, { alasan: reason || 'AFK', time: Date.now() });
            }, 7000);
        } else {
            await db.delete(message.author.id);
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