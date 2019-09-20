const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    let uicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setColor("RANDOM")
        .setThumbnail(uicon)
        .addField("k!about", "Melihat Tentang BOT Kato")
        .addField("k!avatar", "Melihat Avatar seseorang")
        .addField("k!stats", "Melihat Status PC yang menjalankan BOT Kato")
        .addField("k!userinfo", "Melihat Info User")
        .addField("k!serverinfo", "Melihat Info Server")
        
        return message.channel.send(botembed);
}

    
module.exports.help = {
        name : "info"
    }