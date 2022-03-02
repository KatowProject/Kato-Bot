const { MessageEmbed } = require("discord.js");
const axios = require('axios');

exports.run = async (client, message, args) => {
  try {

    const response = await axios.get('https://nekos.life/api/v2/img/hug');
    const hug = response.data;

    let member = message.mentions.members.first();
    if (!args[0]) return message.reply("mention seseorang untuk melanjutkan!");
    const embed = new MessageEmbed();

    if (message.author.id === member.user.id) {

      embed.setTitle('Kamu memeluk diri sendiri 😳')
      embed.setColor(client.warna.kato)
      embed.setImage(hug.url)

      message.channel.send(embed);

    } else {

      embed.setTitle(`${message.guild.member(message.author).displayName} memeluk ${message.guild.member(member).displayName} (✿◡‿◡)`)
      embed.setColor(client.warna.kato)
      embed.setImage(hug.url)

      message.channel.send(embed);

    };

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["peluk"],
  cooldown: 5
}

exports.help = {
  name: 'hug',
  description: 'reaksi',
  usage: 'k!hug <user>',
  example: 'k!hug @juned'
}