//ini hanyalah embed gunakan RAS dengan BOT YUI

const Discord = require("discord.js");

var santai = "<:santai:586185795128262686>";

module.exports.run = async (bot, message, args) => {
        let botembed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(message.guild.name, message.guild.iconURL)
        .addField("Klaim Role Santai", "Mengakses Channel yang telah disediakan Server")
        .addField("Cara Mendapatkannya", `React ${santai} untuk mendapatkannya `)
        return message.channel.send(botembed);
}

module.exports.help = {
    name : "starting"
}
