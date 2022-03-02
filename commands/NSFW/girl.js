const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {

  if (!message.channel.nsfw) return;

  try {

    const responseOne = await axios.get('https://nekos.life/api/v2/img/solo');
    const responseTwo = await axios.get('https://nekos.life/api/v2/img/solog');
    const responseThree = await axios.get('https://nekos.life/api/v2/img/keta');

    const genre = [responseOne.data, responseTwo.data, responseThree.data];
    const random = genre[Math.floor(Math.random() * genre.length)];

    const girl = random;
    let embed = new Discord.MessageEmbed()
      .setTitle('( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)')
      .setColor('#985ce7')
      .setImage(girl.url)

    message.channel.send(embed);

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: [],
  cooldown: 1
}

exports.help = {
  name: 'girl',
  description: 'Gets a NSFW URL of a solo girl image/gif',
  usage: 'k!girl',
  example: 'k!girl  '
}