    const Discord = require("discord.js")

    module.exports.run = async (bot, message, args) => {
        let botembed = new Discord.RichEmbed()
        .setColor("#985ce7")
        .setAuthor(message.guild.name, message.guild.iconURL)
        .addField("k!bisu", "Membisukan Sebuah User")
        .addField("k!tempbisu", "Membisukan Sebuah User dengan Durasi")
        .addField("k!kick", "Menendang Sebuah User")
        .addField("k!ban" , "Mengeluarkan Sebuah User Sepenuhnya")
        .addField("k!elm" , "Memberikan Role ELM")
        .addField("k!unelm" , "Melepaskan Role ELM")
        .addField("k!unmute" , "Menghilangkan Status Bisu")
        .addField("k!unban" , "Menghapus Status BAN pada sebuah user")
        .addField("k!addrole", "Menambahkan Role kepada User")
        .addField("k!removerole","Menarik/Melepaskan Role kepada User")
        return message.channel.send(botembed);
}


module.exports.help = {
    name : "moderasi"
}
