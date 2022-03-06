const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {
  try {
    let query = args.join(' ');
    if (query.includes('youtube.com')) return ytdl(query.match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/)[1]);
    if (!query) return message.reply('Silahkan masukkan permintaan terlebih dahulu!');

    const embed = new Discord.MessageEmbed().setColor('RANDOM').setTimestamp();
    const res = await axios.get('http://posantai.bugs.today/ytdl/api/search/' + query.split(' ').join('+'));
    const data = res.data;
    if (data.length === 0) return message.reply('Pencarian tidak ditemukan!');
    const chunkVideo = data.slice(0, 10);

    embed.setAuthor(`Hasil Pencarian dari ${query} | YTDL`, 'https://cdn.discordapp.com/attachments/795771950076133438/856672584170602507/174883.png')
    embed.setDescription(chunkVideo.map((a, i) => `**${i + 1}. ${a.title} **| [${a.author.name}](${a.author.url}) | \`${a.timestamp}\``).join('\n'));

    const msgEmbed = await message.channel.send({ embeds: [embed] });
    const msgAlert = await message.reply('Pilih menggunakan angka!');

    const messageReqeust = await message.channel.createMessageCollector({ filter: (m) => m.author.id === message.author.id, time: 200000 });
    messageReqeust.on('collect', f => {
      const argss = ['cancel', 'batal', 'gajadi', 'salah'];
      if (argss.includes(f.content)) {
        messageReqeust.stop();
        msgEmbed.delete();
        msgAlert.delete();
        return message.reply('Pencarian dibatalkan!').then((a) => a.delete({ timeout: 5000 }));
      };

      if (parseInt(f.content)) {
        messageReqeust.stop();
        msgEmbed.delete();
        msgAlert.delete();

        const num = parseInt(f.content);
        return ytdl(chunkVideo[num - 1]);
      }
      message.reply('Permintaan Harus Valid 1 - 10');
    });

    async function ytdl(datas) {
      const res = await axios.get('http://posantai.bugs.today/ytdl/api/info/' + datas.videoId);
      const data = res.data;

      const embedInfo = new Discord.MessageEmbed().setColor('RANDOM')
        .setTitle(data.info.title)
        .addField('Durasi', client.util.parseDur(data.info.lengthSeconds * 1000), true)
        .addField('ID', data.info.videoId, true)
        .setImage(data.info.thumbnail.thumbnails.pop().url)

      message.channel.send({ embeds: [embedInfo] });

      const embedDl = new Discord.MessageEmbed().setColor('RANDOM').setTitle('Download Link');

      const video = data.video.map((a, i) => `[${a.qualityLabel}](http://posantai.bugs.today/ytdl/api/download/${datas.videoId}/default/${a.qualityLabel})`);
      const audioOnly = data.audioOnly.map((a, i) => `[${a.audioQuality} | ${Math.floor(a.averageBitrate / 1000)}Kbps](http://posantai.bugs.today/ytdl/api/download/${datas.videoId}/audioOnly/default)`);
      const videoOnly = data.videoOnly.map((a, i) => `[${a.qualityLabel}](http://posantai.bugs.today/ytdl/api/download/${datas.videoId}/videoOnly/${a.qualityLabel})`);

      embedDl.setDescription(`**Video**\n${video.join('\n')}\n\n**Audio**\n${audioOnly.join('\n')}\n\n**Video without audio**\n${videoOnly.join('\n')}`);
      message.channel.send({ embeds: [embedDl] });
    }

  } catch (err) {
    message.reply('Something went wrong:\n' + err.message);
  }
}

exports.conf = {
  aliases: ['ytdl', 'yt'],
  cooldown: 5,
}

exports.help = {
  name: 'youtube',
  description: 'youtube downloader',
  usage: 'youtube <query>',
  example: 'youtube search kato cantik'
}