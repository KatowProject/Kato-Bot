const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
        let botembed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(message.guild.name, message.guild.iconURL)
        .addField("Klaim Role NSFW", "Fungsinya untuk mengakses channel NSFW ")
        .addField("Cara Mendapatkannya", "React <:nsfw:595085846810722314> agar bisa mendapatkan rolenya ")
        return message.channel.send(botembed);
}

module.exports.help = {
    name : "hidden"
}