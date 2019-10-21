const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    let botembed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(message.guild.name, message.guild.iconURL)
    .addField("k!reaction", "Berikan Reaksi mu dengan gambar!")
    .addField("k!tanya", "Kamu bertanya , maka aku akan menjawabnya!")
    .addField("k!say", "Aku akan mengikuti apa yang kamu tulis!")
    .addField("k!madoka" , "Attachment Member")
    .addField("k!tindas" , "Attachment Member")
    .addField("k!haruna" , "Attachment Member")
    
    return message.channel.send(botembed);
}


module.exports.help = {
name : "moderasi"
}
