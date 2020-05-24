const Discord = require('discord.js');
const randomPuppy = require('random-puppy')

exports.run = async (client, message, args) => {
  try {
    const subReddits = ["dankmeme", "meme", "me_irl"];
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];

    const img = await randomPuppy(random);
    const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setImage(img)
        .setTitle(`From /r/${random}`)
        .setURL(`https://reddit.com/r/${random}`);

    message.channel.send(embed);

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
  name: 'puppy',
  description: 'gtw',
  usage: 'k!puppy',
  example: 'k!puppy'
}