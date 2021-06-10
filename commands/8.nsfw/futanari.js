const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {

  if (!message.channel.nsfw) return;

  try {

    const response = await axios.get('https://nekos.life/api/v2/img/futanari');
    const futanari = response.data;

    const embed = new Discord.MessageEmbed()
      .setTitle('( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)')
      .setColor('#985ce7')
      .setImage(futanari.url)

    message.channel.send(embed);

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ['futa'],
  cooldown: 1
}

exports.help = {
  name: 'futanari',
  description: 'Gets a NSFW URL of an/a image/gif of futa',
  usage: 'k!futanari',
  example: 'k!futanari'
}