const Discord = require('discord.js');
const neko = require('nekos.life')
const { nsfw } = new neko()

exports.run = async (client, message, args) => {
  if (!message.channel.nsfw) return
  else {
    if (message.channel.id === '604660186593886229') return
  };
  try {

    rhentai = await nsfw.kuni()
    let embed = new Discord.MessageEmbed()
      .setTitle('( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)')
      .setColor('#985ce7')
      .setImage(rhentai.url)

    message.channel.send(embed)
  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ['jilmek'],
  cooldown: 1
}

exports.help = {
  name: 'kuni',
  description: 'Get a NSFW URL of a kuni image/gif',
  usage: 'k!kuni',
  example: 'k!kuni'
}