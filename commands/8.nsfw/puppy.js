const Discord = require('discord.js');

exports.run = async (client, message, args) => {

  if (!message.channel.nsfw) return
  else {
    if (message.channel.id === '604660186593886229') return
  };
  let rl = args[0] === "3d";
  let dm = args[0] === "2d";

  try {

    if (!args[0]) {
      const subReddits = ["nsfw", "NSFW_GIF", "porn", "rule34", "hentai", "gonewild", "nsfw_gifs", "RealGirls"];
      const random = subReddits[Math.floor(Math.random() * subReddits.length)];
      require('got')(`https://www.reddit.com/r/${random}/random/.json`).then(response => {
        const content = JSON.parse(response.body)
        img = content[0].data.children[0].data.url
        const embed = new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setTitle(`From /r/${random}`)
          .setURL(`https://reddit.com/r/${random}`);
        message.channel.send(embed); message.channel.send(img)
      })
    } else

      if (rl) {
        const subReddits = ["nsfw", "NSFW_GIF", "porn", "gonewild", "nsfw_gifs", "RealGirls"];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        require('got')(`https://www.reddit.com/r/${random}/random/.json`).then(response => {
          const content = JSON.parse(response.body)
          img = content[0].data.children[0].data.url
          const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`From /r/${random}`)
            .setURL(`https://reddit.com/r/${random}`);
          message.channel.send(embed); message.channel.send(img)
        })
      } else

        if (dm) {
          const subReddits = ["rule34", "HelplessHentai", "funpiece", "HENTAI_GIF"]; //HelplessHentai, ahegao, ecchi
          const random = subReddits[Math.floor(Math.random() * subReddits.length)];
          require('got')(`https://www.reddit.com/r/${random}/random/.json`).then(response => {
            const content = JSON.parse(response.body)
            img = content[0].data.children[0].data.url
            const embed = new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setTitle(`From /r/${random}`)
              .setURL(`https://reddit.com/r/${random}`);
            message.channel.send(embed); message.channel.send(img)
          })
        }
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
  name: 'random',
  description: 'gtw',
  usage: 'k!puppy',
  example: 'k!puppy'
}