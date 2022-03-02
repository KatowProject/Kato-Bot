const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {

  if (!message.channel.nsfw) return;

  try {

    const response = await axios.get('https://nekos.life/api/v2/img/kuni');
    const kuni = response.data;

    const embed = new Discord.MessageEmbed()
      .setTitle('( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)')
      .setColor('#985ce7')
      .setImage(kuni.url)

    message.channel.send(embed);

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ['jilmek'],
  cooldown: 1
}

exports.help = {
  name: 'kuni',
  description: 'Get a NSFW URL of a kuni image/gif',
  usage: 'k!kuni',
  example: 'k!kuni'
}