const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    let embed = new Discord.MessageEmbed()
        .setColor(client.warna.kato)
        .setTitle('HBD 🎉🎉🎉 Kato')
        .setImage('https://cdn.discordapp.com/attachments/496983030993518592/758128058900545586/i11110444810.gif')
    await message.channel.send(embed)

}

exports.conf = {
    aliases: [],
    cooldown: 5
};

exports.help = {
    name: 'kato',
    description: 'kato',
    usage: 'kato',
    example: 'kato'
};