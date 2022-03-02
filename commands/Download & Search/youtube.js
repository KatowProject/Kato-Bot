const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {

  try {

    let query = args.join(' '); 
    if (!query) return message.reply('masukkan permintaan terlebih dahulu!');

    if (query.startsWith('https')) query = query.match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/)[1];
    let data = await axios.get(`https://katowo.glitch.me/api/info/${query}`); data = data.data;


    let embed = new Discord.MessageEmbed()
    .setColor(client.warna.kato)
    .setTitle(data.info.title)
    .addField('Durasi', client.util.parseDur(data.info.lengthSeconds * 1000), true)
    .addField('ID', data.info.videoId, true)
    .setImage(data.info.thumbnail.thumbnails.pop().url)
    
    await message.channel.send(embed);

    
    let tempRes = {default: [], audioOnly: [], videoOnly: []};
    for(i = 0; i < data.video.length; i++) {
        tempRes.default[i]      = `[${i + 1}. ${data.video[i].qualityLabel}](https://katowo.glitch.me/api/download/${query}/default/${data.video[i].qualityLabel})`;
    }

    for(i = 0; i < data.videoOnly.length; i++) {
        tempRes.videoOnly[i]    = `[${i + 1}. ${data.videoOnly[i].qualityLabel}](https://katowo.glitch.me/api/download/${query}/videoOnly/${data.videoOnly[i].qualityLabel})`;
    };

    tempRes.audioOnly[0]    = `[${1}. ${data.audioOnly.shift().audioQuality}](https://katowo.glitch.me/api/download/${query}/audioOnly/default)`;

    let embede = new Discord.MessageEmbed()
    .setColor(client.warna.kato)
    .setTitle('Resolusi yang tersedia')
    .setDescription(`**Video dengan audio**\n${tempRes.default.join('\n')}\n\n**Audio Only**\n${tempRes.audioOnly.join('\n')}\n\n**Video Only**\n${tempRes.videoOnly.join('\n')}`)
    
    await message.channel.send(embede)
    

  } catch (error) {
    console.log(error)
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["ytdl"],
  cooldown: 5
}

exports.help = {
  name: 'youtube',
  description: 'download video di youtube',
  usage: 'k!ytdl <link||id>',
  example: 'k!about c9K1tiCUMyY'
}