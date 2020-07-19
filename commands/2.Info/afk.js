const Discord = require('discord.js');
const everyone = [
    "https://cdn.discordapp.com/attachments/447408276628307969/734078581579186236/4c64e343e788251fb15dac0f4c557337.gif"
]

let db = require('quick.db')

exports.run = async (client, message, args) => {
    try {
        const status = new db.table('AFKs')
        let afk = await status.fetch(message.author.id)

        let reason = args.join(' ')
        if (reason.split(' ').includes('@everyone' || '@here')) {
            reason = reason.replace("@everyone", everyone)
        } else {
            reason = reason.replace('@here', everyone)
        }


        if (!afk) {
            message.channel.send(`**${message.author.tag}** telah AFK! \n**Alasan:** ${reason ? reason : "AFK"}`)
            status.set(message.author.id, reason || 'AFK')
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
    cooldown: 10
}

exports.help = {
    name: 'afk',
    description: 'menambahkan status afk pada user',
    usage: 'k!avatar [mention/userid/server]',
    example: 'k!avatar @juned | k!avatar 458342161474387999 | k!avatar server'
}