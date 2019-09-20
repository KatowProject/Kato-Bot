const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
        let botembed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .addField("yo! urang kato", "Kunaon, euy? rek ngobrol, ya?")
        return message.channel.send(botembed);
}

module.exports.help = {
    name : "yo"
}