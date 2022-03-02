const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (!args[0]) return message.channel.send('Penggunaan : **k!poll <insert text>**');
    var isi = args.join(' ');
    if (isi.length <= 10) return;

    let embed = new Discord.MessageEmbed()
      .setAuthor('Voting')
      .setDescription(isi)
      .setFooter('Beri Reaksi untuk vote!')
      .setColor(client.warna.kato)

    let msg = await message.channel.send(embed);

    await msg.react('✅');
    await msg.react('❌');
  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  };
};

exports.conf = {
  aliases: [],
  cooldown: 60
};

exports.help = {
  name: 'poll',
  description: 'polling',
  usage: 'k!poll',
  example: 'k!poll'
};