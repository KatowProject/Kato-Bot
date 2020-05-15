const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {
      
    } catch (error) {
      return message.channel.send(`Something went wrong: ${error.message}`);
      // Restart the bot as usual.
    }
}

exports.conf = {
  aliases: [],
  cooldown: 5
}

exports.help = {
  name: 'base',
  description: '',
  usage: '',
  example: ''
}