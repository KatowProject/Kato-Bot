const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {

    var saran = args.join(' ');
    if (saran.length <= 10) return message.reply('Penggunaan harus lebih dari 10 karakter!').then(t => t.delete({ timeout: 5000 }));

    message.delete();

    let embed = new Discord.MessageEmbed()
      .setColor(client.warna.kato)
      .setAuthor(message.guild.name, message.guild.iconURL())
      .addField("Masukan Dari : ", message.author || message.author.tag, true)
      .addField("isi : ", saran)
      .setFooter(`${message.author.tag} (ID : ${message.author.id})`)
    message.guild.channels.cache.find(guild => guild.name === "feedbacks").send(embed).catch((err) => {
      message.reply('buatlah channel dengan nama **Feedbacks**!');
    });

    return message.reply("Saran kamu sudah terkirim!").then(t => t.delete({ timeout: 5000 }));

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  };
};

exports.conf = {
  aliases: ["suggest"],
  cooldown: 30
};

exports.help = {
  name: 'saran',
  description: 'memberikan saran untuk server',
  usage: 'k!saran [isi]',
  example: 'k!saran kato cantik'
};