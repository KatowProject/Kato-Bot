const Discord = require('discord.js');
const neko = require('nekos.life')
const { nsfw } = new neko()

exports.run = async (client, message, args) => {
  if (!message.channel.nsfw) return
  else {
    if (message.channel.id === '604660186593886229') return
  };
  try {
    const genre = [nsfw.hentai(), nsfw.classic()];
    const random = genre[Math.floor(Math.random() * genre.length)];
    rhentai = await random
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
  aliases: ["classic"],
  cooldown: 1
}

exports.help = {
  name: 'hentai',
  description: 'Gets a NSFW URL of an/a image/gif of hentai',
  usage: 'k!hentai',
  example: 'k!hentai'
}