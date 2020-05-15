const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if(!args[0]) return message.reply("isi teks terlebih dahulu!")
    message.delete()

    let embed = new Discord.MessageEmbed()
    .setColor("#985ce7")
    .setAuthor(message.guild.name, message.guild.iconURL())
    .addField("Laporan Dari : ", message.author, true)
    .addField("Isi : ", args.join(' '))
    .setFooter( `${message.author.tag} (ID : ${message.author.id})`)

    //eksekusi
    message.guild.channels.cache.find(guild => guild.name === "feedbacks").send(embed);
    message.channel.send("Laporan kamu sudah dikirim!");

    } catch (error) {
      return message.channel.send(`Something went wrong: ${error.message}`);
      // Restart the bot as usual.
    }
}

exports.conf = {
  aliases: [],
  cooldown: 5
}

exports.help = {
  name: 'lapor',
  description: 'memberikan laporan untuk server',
  usage: 'k!lapor [isi]',
  example: 'k!lapor kato cantik'
}