const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {
  if (!message.channel.nsfw) return;

  try {

    const response = await axios.get('https://nekos.life/api/v2/img/avatar');
    const avatar = response.data;

    const embed = new Discord.MessageEmbed()
      .setTitle('( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)')
      .setColor('#985ce7')
      .setImage(avatar.url)

    message.channel.send(embed)
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
  name: 'navatar',
  description: 'Gets a NSFW URL of an avatar image/gif',
  usage: 'k!navatar',
  example: 'k!navatar'
}