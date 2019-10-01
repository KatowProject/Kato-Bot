    const Discord = require("discord.js")

    module.exports.run = async (bot, message, args) => {
        let botembed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(message.guild.name, message.guild.iconURL)
        .addField("k!bisu", "Membisukan Sebuah User")
        .addField("k!tempbisu", "Membisukan Sebuah User dengan Durasi")
        .addField("k!kick", "Menendang Sebuah User")
        .addField("k!ban" , "Mengeluarkan Sebuah User Sepenuhnya")
        .addField("k!unmute" , "Menghilangkan Status Bisu")
        .addField("k!unban" , "Menghapus Status BAN pada sebuah user")
        .addField("k!addrole", "Menambahkan Role kepada User")
        .addField("k!removerole","Menarik/Melepaskan Role kepada User")
        .setFooter("Stable Release | ManLord#3143")
        .setAuthor(message.guild.name, message.guild.iconURL)
        return message.channel.send(botembed);
}


module.exports.help = {
    name : "moderasi"
}
