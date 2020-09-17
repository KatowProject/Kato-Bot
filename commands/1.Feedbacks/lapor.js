const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {

    var saran = args.join(' ')
    if (saran.length <= 10) return message.reply('Penggunaan harus lebih dari 10 karakter!').then(t => t.delete({ timeout: 5000 }))

    message.delete()

    let embed = new Discord.MessageEmbed()
      .setColor(client.warna.kato)
      .setAuthor(message.guild.name, message.guild.iconURL())
      .addField("Laporan Dari : ", message.author, true)
      .addField("Isi : ", saran)
      .setFooter(`${message.author.tag} (ID : ${message.author.id})`)

    //eksekusi
    message.guild.channels.cache.find(guild => guild.name === "feedbacks").send(embed);
    return message.reply("Laporan kamu sudah terkirim!").then(t => t.delete({ timeout: 5000 }));

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: [],
  cooldown: 30
}

exports.help = {
  name: 'lapor',
  description: 'memberikan laporan untuk server',
  usage: 'k!lapor [isi]',
  example: 'k!lapor kato cantik'
}