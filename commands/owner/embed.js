const Discord = require('discord.js');


exports.run = async (client, message, args) => {
    try {

        let embed = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setAuthor('Fungsi Role:')
            .addField('FPS, Rythm, Among Us, dan MOBA', 'Mencari teman lalu membuat party bersama.')
            .setThumbnail('https://media.discordapp.net/attachments/670937626093682705/700685194360913920/Watermark_POS.png')
        await message.channel.send(embed)

        let embede = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setAuthor('Cara Mendapatkan Role:')
            .addField('Role FPS @FPS', 'React 🔫 untuk mendapatkan Role FPS')
            .addField('Role Rythm @Rythm', 'React 🎶 untuk mendapatkan Role Rythm')
            .addField('Role Among Us @Among Us', 'React 🕵️‍♀️ untuk mendapatkan Role Among Us')
            .addField('Role MOBA @MOBA', 'React 🏹 untuk mendapatkan Role MOBA')
        await message.channel.send(embede)

        let embeded = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setAuthor('Role Pilihan')
            .addField('🔫', 'FPS', true)
            .addField('🎶', 'Rythm', true)
            .addField('🕵️‍♀️', 'Among Us', true)
            .addField('🏹', 'MOBA', true)
        await message.channel.send(embeded)

    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'base',
    description: '',
    usage: '',
    example: ''
}