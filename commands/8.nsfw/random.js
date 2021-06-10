const Discord = require('discord.js');
const axios = require('axios');
const db = require('quick.db');

exports.run = async (client, message, args) => {

  if (!message.channel.nsfw) return;

  /* get mainURL in database */
  let req = args[0]
  if (req === undefined) req = undefined
  if (!req === undefined) req = args[0].toLowerCase()
  let source;
  switch (req) {
    case '2d':
      source = db.get('nsfw2D');
      break;
    case '3d':
      source = db.get('nsfw3D');
      break;
    default:
      let source2D = db.get('nsfw2D');
      let source3D = db.get('nsfw3D');
      source = source2D.concat(source3D);
      break;
  };
  let reSource = source[client.util.randomNumber(source)];
  console.log(reSource)

  /* get imageURL */
  let scrap = await axios.get(reSource);
  let obj = {};
  try {
    obj.URL = scrap.data[0].data.children[0].data.url;
    obj.title = scrap.data[0].data.children[0].data.title;
  } catch (error) {
    let length = scrap.data.data.children.length
    obj.URL = scrap.data.data.children[Math.floor(Math.random() * length)].data.url;
    obj.title = scrap.data.data.children[Math.floor(Math.random() * length)].data.title;
  }


  /* get FormatURL */
  let formatURL;
  try {
    formatURL = obj.URL.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)[0];
  } catch (error) {
    formatURL = obj.URL;
  }

  /* send to user */
  const embed = new Discord.MessageEmbed()
  if (['.png', '.jpg', '.jpeg', '.gif'].includes(formatURL)) {
    embed.setAuthor(`from r/${reSource.split('/')[4]}`, 'https://cdn.discordapp.com/attachments/496983030993518592/783388993051951134/reddit.png', reSource)
    embed.setDescription(obj.title)
    embed.setImage(obj.URL);

    message.channel.send(embed);
  } else {
    embed.setAuthor(`from r/${reSource.split('/')[4]}`, 'https://cdn.discordapp.com/attachments/496983030993518592/783388993051951134/reddit.png', reSource)
    embed.setDescription(obj.title)
    await message.channel.send(embed);
    await message.channel.send(obj.URL);
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