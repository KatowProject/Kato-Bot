const Discord = require('discord.js');
const neko = require('nekos.life')
const { nsfw } = new neko()

exports.run = async (client, message, args) => {
  if (!['795771950076133438', '796006565240766485'].includes(message.channel.id)) return;
  try {
    rhentai = await nsfw.boobs()
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
  aliases: ["tt"],
  cooldown: 1
}

exports.help = {
  name: 'boobs',
  description: 'Gets a NSFW URL of boobs image/gif',
  usage: 'k!boobs',
  example: 'k!boobs'
}