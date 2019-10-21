const Discord = require("discord.js");

var haha = "<:haha:556730216504885249>"
var santai = "<:santai:586185795128262686>"
module.exports.run = async (bot, message, args) => {
        
    let botembed = new Discord.RichEmbed()
    let bicon = bot.user.displayAvatarURL
    .setColor("#46cb18")
    .setThumbnail(bicon)
    .setAuthor(message.guild.name, message.guild.iconURL)
    .setTitle(`Kato-Bot | Bot Local ${santai} `)
    .addField(` :tools: **Moderasi** :tools:`, "`k!moderasi`", true)
    .addField(` :mega:  **Feedbacks** :mega:  `, "`k!feedbacks`", true)
    .addField(`:information_source:  **Info** :information_source: `, "k!Info", true)
    .addField(` ${haha} **Fun** ${haha} ` , "k!fun" , true)
    
      

        return message.channel.send(botembed);
}

module.exports.help = {
    name : "help"
}
