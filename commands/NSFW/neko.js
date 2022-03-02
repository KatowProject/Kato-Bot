const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {

  if (!message.channel.nsfw) return;

  try {

    const responseOne = await axios.get('https://nekos.life/api/v2/img/neko');
    const responseTwo = await axios.get('https://nekos.life/api/v2/img/nsfw_neko_gif');
    const responseThree = await axios.get('https://nekos.life/api/v2/img/erokemo');
    const responseFour = await axios.get('https://nekos.life/api/v2/img/lewdk');
    const responseFive = await axios.get('https://nekos.life/api/v2/img/erok');
    const responseSix = await axios.get('https://nekos.life/api/v2/img/holo');

    const genre = [responseOne.data, responseTwo.data, responseThree.data, responseFour.data, responseFive.data, responseSix.data];
    const random = genre[Math.floor(Math.random() * genre.length)];
    const neko = random;

    const embed = new Discord.MessageEmbed()
      .setTitle('( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)')
      .setColor('#985ce7')
      .setImage(neko.url)

    message.channel.send(embed);

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ['neko', 'kitsune'],
  cooldown: 1
}

exports.help = {
  name: 'kemonomimi',
  description: 'Get a NSFW URL of a kemonomimi image/gif',
  usage: 'k!kemonomimi',
  example: 'k!neko'
}