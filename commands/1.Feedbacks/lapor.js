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
      .addField("Laporan Dari : ", message.author, true)
      .addField("Isi : ", saran)
      .setFooter(`${message.author.tag} (ID : ${message.author.id})`)

    //eksekusi
    const getChannel = dataGuild.feedbacks;
    if (getChannel === "null") return message.reply('Channel Belum diatur, silahkah atur dengan menjalankan perintah k!logs').then(a => a.delete({ timeout: 5000 }));
    message.guild.channels.cache.get(getChannel).send(embed).then(msg => message.reply("Laporan kamu sudah terkirim!"));

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  };
};

exports.conf = {
  aliases: [],
  cooldown: 30,
  permissions: [],
};

exports.help = {
  name: 'lapor',
  description: 'memberikan laporan untuk server',
  usage: 'k!lapor [isi]',
  example: 'k!lapor kato cantik'
};