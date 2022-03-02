const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {
  if (!message.channel.nsfw) return;

  try {

    const response = await axios.get('https://nekos.life/api/v2/img/boobs');
    const boobs = response.data;
    const embed = new Discord.MessageEmbed()
      .setTitle('( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)')
      .setColor('#985ce7')
      .setImage(boobs.url)

    message.channel.send(embed);

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["tt"],
  cooldown: 1
}

exports.help = {
  name: 'boobs',
  description: 'Gets a NSFW URL of boobs image/gif',
  usage: 'k!boobs',
  example: 'k!boobs'
}