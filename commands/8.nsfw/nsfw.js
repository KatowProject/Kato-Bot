const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  if (!message.channel.nsfw) return
  else {
    if (message.channel.id === '604660186593886229') return
  };
  try {
    let embed = new Discord.MessageEmbed()
      .addTitle('aw')

    message.channe.send(embed)
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
  name: 'nsfw',
  description: 'nsfw commands list',
  usage: 'k!nsfw',
  example: 'k!nsfw'
}