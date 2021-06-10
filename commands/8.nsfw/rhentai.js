const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {

  if (!message.channel.nsfw) return;

  try {

    const response = await axios.get('https://nekos.life/api/v2/img/Random_hentai_gif');
    const rhentai = response.data;

    const embed = new Discord.MessageEmbed()
      .setTitle('( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)')
      .setColor('#985ce7')
      .setImage(rhentai.url)

    message.channel.send(embed);

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["randomHentaiGif"],
  cooldown: 1
}

exports.help = {
  name: 'rhentai',
  description: 'Get a URL of hentai gif',
  usage: 'k!rhentai',
  example: 'k!rhentai'
}