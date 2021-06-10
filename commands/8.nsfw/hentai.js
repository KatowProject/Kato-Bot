const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {

  if (!message.channel.nsfw) return;

  try {

    const responseOne = await axios.get('https://nekos.life/api/v2/img/hentai');
    const responseTwo = await axios.get('https://nekos.life/api/v2/img/classic');

    const genre = [responseOne.data, responseTwo.data]
    const random = genre[Math.floor(Math.random() * genre.length)];

    const hentai = random;
    const embed = new Discord.MessageEmbed()
      .setTitle('( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)')
      .setColor('#985ce7')
      .setImage(hentai.url)

    message.channel.send(embed);

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["classic"],
  cooldown: 1
}

exports.help = {
  name: 'hentai',
  description: 'Gets a NSFW URL of an/a image/gif of hentai',
  usage: 'k!hentai',
  example: 'k!hentai'
}