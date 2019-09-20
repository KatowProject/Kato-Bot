const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let msgEmbed = new Discord.RichEmbed()
    .setDescription(":clock1: Sebentar, kato akan mengambil fotomu sebentar, ya!")
    await message.channel.send(msgEmbed).then(msgEmbed => msgEmbed.delete());

    let target = message.mentions.members.first() || message.member;
    

    let targeticon = (target.displayAvatarURL)
    let avatarEmbed = new Discord.RichEmbed()
    .setTitle("Ini avatarnya!")
    .setImage(targeticon)
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter("BETA Release | ManLord#3143")

    await message.channel.send(avatarEmbed);
}

module.exports.help = {
    name : "avatar"
}