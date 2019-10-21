const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    var saran = args.slice(0).join(" ");
    message.delete().catch(O_o=>{});

    let embed = new Discord.RichEmbed()
    .setColor("#985ce7")
    .addField("Masukan Dari : ", message.author, true)
    .addField("Isi", saran)
    .setFooter(`ID: ${message.member.id}`, message.guild.iconURL)
    
    let channel = message.guild.channels.find("name", "feedbacks").send(embed);
    message.channel.send("Saran kamu sudah dikirim!");

}

module.exports.help = {
    name : "saran"
}

/*
    Keterangan:
    • args.slice(0).join(" "); = argumen1
        k.saran argumen1
*/
