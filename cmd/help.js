const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
        let bicon = bot.user.displayAvatarURL;
        let botembed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setThumbnail(bicon)
        .setAuthor(message.guild.name, message.guild.iconURL)
        .setAuthor("List Kategori Perintah")
        .setFooter("Stable Release | ManLord#3143")
        .addField("``k!feedbacks``","Kato akan menunjukkan Commands untuk Kebutuhan Feedbacks.")
        .addField("``k!moderasi``", "Kato akan menunjukkan Commands untuk Kebutuhan Moderasi.")
        .addField("``k!info``", "Kato akan menunjukkan Commands yang berhubungan dengan info/biodata.")
    
      

        return message.channel.send(botembed);
}

module.exports.help = {
    name : "help"
}
