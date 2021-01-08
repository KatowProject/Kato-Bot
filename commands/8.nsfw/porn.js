const Discord = require('discord.js');
const scathach = require('scathach-api')
const { nsfw } = new scathach()

exports.run = async (client, message, args) => {
  if (!['710431360954794004'].includes(message.channel.id)) return;
  try {
    rhentai = await nsfw.gif()
    let embed = new Discord.MessageEmbed()
      .setTitle('CROTT')
      .setColor('#985ce7')
      .setImage(rhentai.url)

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
  name: 'porn',
  description: 'Gets a random porn gifs',
  usage: 'k!porn',
  example: 'k!porn',
  hide: true
}