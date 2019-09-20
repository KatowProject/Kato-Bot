const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
        let bicon = bot.user.displayAvatarURL;
        let botembed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setThumbnail(bicon)
        .setAuthor("List Perintah")
        .setFooter(" BETA Release | ManLord#3143")
        .addField("``k.addrole``", "Menambahkan/Memberikan Role Kepada yang bersangkutan.")
        .addField("``k.removerole``", "Menghilangkan Role Kepada yang bersangkutan.")
        .addField("``k.mute``", "Memberikan Role Muted.")
        .addField("``k.tempmute``", "Memberikan Role Muted dengan Durasi")
        .addField("``k.warn``", "Memberi Peringatan kepada yang bersangkutan.")
        .addField("``k.warnlevel``", "~~Melihat Riwayat Peringatan kepada yang bersangkutan~~")
        .addField("``k.kick``", ":four_leaf_clover:")
        .addField("``k.ban``", "Ku pukul kau pakai Palu.")
        .addField("``k.unban``", "Menghilangkan Status BAN")
        

        return message.channel.send(botembed);
}

module.exports.help = {
    name : "admin"
}