const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {
  if (!message.channel.nsfw) return;
  try {
    const response = await axios.get('https://scathach.redsplit.org/v3/nsfw/gif/');
    const porn = response.data;

    const embed = new Discord.MessageEmbed()
      .setTitle('CROTT')
      .setColor('#985ce7')
      .setImage(porn.url)
    message.channel.send({ embeds: [embed] });
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