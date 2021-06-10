const Discord = require('discord.js');
const db = require('../../database').log;

exports.run = async (client, message, args) => {
  try {

    const dataGuild = db.get(message.guild.id);

    const saran = args.join(' ');
    if (saran.length <= 10) return message.reply('Penggunaan harus lebih dari 10 karakter!').then(t => t.delete({ timeout: 5000 }));

    message.delete();

    let embed = new Discord.MessageEmbed()
      .setColor(client.warna.kato)
      .setAuthor(message.guild.name, message.guild.iconURL())
      .addField("Masukan Dari : ", message.author || message.author.tag, true)
      .addField("isi : ", saran)
      .setFooter(`Author: ${message.author.tag} | ID: ${message.author.id}`)


    const getChannel = dataGuild.feedbacks;
    if (getChannel === 'null') return message.reply('Channel Belum diatur, silahkah atur dengan menjalankan perintah k!logs').then(a => a.delete({ timeout: 5000 }));
    message.guild.channels.cache.get(getChannel).send(embed).then(msg => message.reply('Saran kamu sudah terkirim!'));


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