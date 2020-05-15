const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if(!args[0]) return message.channel.send('Penggunaan : **k!poll <insert text>**')
    var isi = args.join(' ')

    let embed = new Discord.MessageEmbed()
    .setTitle('**Voting**')
    .setDescription(isi)
    .setFooter('Beri Reaksi untuk vote!')
    .setColor("#985ce7")

    let msg = await message.channel.send(embed);

    await msg.react('✅');
    await msg.react('❌');
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
  name: 'poll',
  description: 'polling',
  usage: 'k!poll',
  example: 'k!poll'
}