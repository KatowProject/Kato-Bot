const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    const attachment = new Discord.MessageAttachment('https://image.prntscr.com/image/1MLtCWG0QAmI-ouhaEJXDA.png');
       
    message.channel.send(attachment);
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
  name: 'tindas',
  description: 'tindas',
  usage: 'tindas',
  example: 'tindas'
}