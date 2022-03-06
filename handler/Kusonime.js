const axios = require('axios');
const Discord = require('discord.js');
module.exports = class Kusonime {
    constructor(client) {
        this.client = client;
    }

    getWithSearch(query, message) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(`http://posantai.bugs.today/kusonime/api/cari/${query}`);
                const res = response.data;
                if (res.length === 0) return reject(`Pencarian ${query} tidak ditemukan!`);

                console.log('masuk')
                let page = 1;
                const animes = this.client.util.chunk(res, 10);
                const embed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setDescription(animes[page - 1].map((a, i) => `**${i + 1}.** ${a.title}`).join('\n'));

                const r = await message.channel.send({ content: 'Pilih menggunakan angka!', embeds: [embed] });
                const collector = await message.channel.createMessageCollector({ filter: m => m.author.id === message.author.id, time: 20000 });
                collector.on('collect', async (f) => {
                    if (['cancel', 'gk jadi', 'gak jadi'].includes(f.content.toLowerCase())) {
                        collector.stop();
                        return message.reply('Permintaan dibatalkan!');
                    }
                    if (isNaN(f.content)) return message.reply('Permintaan invalid, gunakanlah angka!');

                    collector.stop();
                    r.delete();

                    console.log(f.content);
                    await this.getDetail(animes[0][parseInt(f.content) - 1], message);
                });

                resolve();
            } catch (e) {
                reject(new Error(e.message));
                console.log(e);
            }
        });
    }

    getDetail(anime, message) {
        return new Promise(async (resolve, reject) => {
            try {
                const endpoint = anime.link.endpoint;
                const response = await axios.get(`http://posantai.bugs.today/kusonime/api/anime/${endpoint}`);
                const res = response.data;
                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle(res.title)
                            .setColor('RANDOM')
                            .setDescription(res.sinopsis.slice(0, 2048))
                            .setImage(res.thumbnail)
                            .addField("Japanese", res.japanese, true)
                            .addField('Genre', res.genre.map((a, i) => `[${a.name}](${a.url})`).join(', '), true)
                            .addField('Season', `[${res.season.name}](${res.season.url})`, true)
                            .addField('Producers', res.producers.join(', '), true)
                            .addField('Total Eps', res.total_eps, true)
                            .addField('Score', res.score, true)
                    ]
                });

                for (const title of res.list_download) {
                    const embed = new Discord.MessageEmbed().setColor('RANDOM').setAuthor(title[0], null, `https://kusonime.com/${endpoint}`);

                    const temp = [];
                    for (const resolution of title[1]) temp.push(`**${resolution.resolusi}**\n${resolution.link_download.map((a, i) => `[${a.platform}](${a.link})`).join('\n')}`);

                    embed.setDescription(temp.join('\n'));
                    message.channel.send({ embeds: [embed] });
                }

                return resolve();
            } catch (e) {
                reject(new Error(e.message));
                console.log(e);
            }
        });
    }
}