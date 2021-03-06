const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {

  if (!message.channel.nsfw) return;

  try {

    const responseOne = await axios.get('https://nekos.life/api/v2/img/les');
    const responseTwo = await axios.get('https://nekos.life/api/v2/img/yuri');
    const responseThree = await axios.get('https://nekos.life/api/v2/img/eroYuri');

    const genre = [responseOne.data, responseTwo.data, responseThree.data];
    const random = genre[Math.floor(Math.random() * genre.length)];

    const lesbian = random;
    let embed = new Discord.MessageEmbed()
      .setTitle('( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)')
      .setColor('#985ce7')
      .setImage(lesbian.url)

    message.channel.send(embed);

  } catch (error) {
    console.log(error);
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["yuri"],
  cooldown: 1
}

exports.help = {
  name: 'lesbian',
  description: 'Get a NSFW URL of a lesbian image/gif',
  usage: 'k!lesbian',
  example: 'k!lesbian'
}