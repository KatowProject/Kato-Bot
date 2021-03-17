const Discord = require('discord.js');
const neko = require('nekos.life')
const { nsfw } = new neko()

exports.run = async (client, message, args) => {
  if (!['795771950076133438', '796006565240766485'].includes(message.channel.id)) return;
  try {
    const genre = [nsfw.pussy(), nsfw.pussyArt(), nsfw.tits(), nsfw.pussyWankGif()]
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
  aliases: [],
  cooldown: 1
}

exports.help = {
  name: 'pussy',
  description: 'Get a NSFW URL of a pussy image/gif',
  usage: 'k!pussy',
  example: 'k!pussy'
}