const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if(!args[0]) return message.reply("isi teks terlebih dahulu!")
    message.delete()

    let embed = new Discord.MessageEmbed()
    .setColor("#985ce7")
    .setAuthor(message.guild.name, message.guild.iconURL())
    .addField("Masukan Dari : ", message.author || message.author.tag, true)
    .addField("isi : ", args.join(" "))
    .setFooter(`${message.author.tag} (ID : ${message.author.id})`)
    message.guild.channels.cache.find(guild => guild.name === "feedbacks").send(embed);
    
    message.channel.send("Saran kamu sudah dikirim!");

    } catch (error) {
      return message.channel.send(`Something went wrong: ${error.message}`);
      // Restart the bot as usual.
    }
}

exports.conf = {
  aliases: ["suggest"],
  cooldown: 5
}

exports.help = {
  name: 'saran',
  description: 'memberikan saran untuk server',
  usage: 'k!saran [isi]',
  example: 'k!saran kato cantik'
}