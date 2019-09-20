const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
        let botembed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(message.guild.name, message.guild.iconURL)
        .addField("Klaim Role FPS dan MOBA", "Fungsinya untuk Mencari Teman lalu Membuat Party Bersama ")
        .addField("Cara Mendapatkannya", "React :gun: untuk role FPS \n React :bow_and_arrow:  untuk role MOBA  ")
        return message.channel.send(botembed);
}

module.exports.help = {
    name : "klaim"
}