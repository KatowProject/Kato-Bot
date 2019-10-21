const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
        let bicon = bot.user.displayAvatarURL;
        let botembed = new Discord.RichEmbed()
        .setColor("#985ce7")
        .setThumbnail(bicon)
        .addField("Nama", "Kato Megumi")
        .addField("Tanggal Lahir", "23 September")
        .addField("Pemilik", "ManLord#3143")
        .addField("Bahasa", "Discord.JS dengan NodeJS")
        .addField("Motto", "Bagi Steam Wallet")
        .addField("Terima Kasih Kepada", "Karen-Araragi-Master dan Kato Megumi Fanbase Server")
        .addField("Tim Pengembang", "The OwO Family dan Bot Commander Kato Megumi Fanbase")
        .setFooter("Stable Release | ManLord#3143")
        .setAuthor(message.guild.name, message.guild.iconURL)
        return message.channel.send(botembed);
}

module.exports.help = {
    name : "about"
}
