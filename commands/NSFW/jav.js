const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {
  if (!message.channel.nsfw) return;

  try {
    const response = await axios.get('https://scathach.redsplit.org/v3/nsfw/jav/');
    const jav = response.data;

    const embed = new Discord.MessageEmbed()
      .setTitle('CROTT')
      .setColor('#985ce7')
      .setImage(jav.url)

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
  name: 'jav',
  description: 'Gets a random jav pic',
  usage: 'k!jav',
  example: 'k!jav',
}