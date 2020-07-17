const Discord = require('discord.js');

let db = require('quick.db')

exports.run = async (client, message, args) => {
    try {
        const status = new db.table('AFKs')
        let afk = await status.fetch(message.author.id)

        if (!afk) {
            message.channel.send(`**${message.author.tag}** telah AFK! \n **Alasan:** ${args.join(' ') ? args.join(' ') : "AFK"}.`)
            status.set(message.author.id, args.join(' ') || 'AFK')
        } else {
            message.reply('Kato telah mencabut status AFK mu!')
            status.delete(message.author.id)
        }



    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}



exports.conf = {
    aliases: ["away"],
    cooldown: 5
}

exports.help = {
    name: 'afk',
    description: 'menambahkan status afk pada user',
    usage: 'k!avatar [mention/userid/server]',
    example: 'k!avatar @juned | k!avatar 458342161474387999 | k!avatar server'
}