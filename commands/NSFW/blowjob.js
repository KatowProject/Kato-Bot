const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {
  if (!message.channel.nsfw) return;

  try {

    const responseOne = await axios.get('https://nekos.life/api/v2/img/blowjob');
    const responseTwo = await axios.get('https://nekos.life/api/v2/img/bj');

    const genre = [responseOne.data, responseTwo.data];
    const random = genre[Math.floor(Math.random() * genre.length)];
    const blowjob = random;

    const embed = new Discord.MessageEmbed()
      .setTitle('( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)')
      .setColor('#985ce7')
      .setImage(blowjob.url)

    message.channel.send(embed)

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["bj"],
  cooldown: 1
}

exports.help = {
  name: 'blowjob',
  description: 'Gets a NSFW URL of bj(blowjob) image/gif',
  usage: 'k!blowjob',
  example: 'k!blowjob'
}