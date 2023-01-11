const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = class Kusonime {
    constructor(client) {
        this.client = client;
    }

    getWithSearch(query, message) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(`https://kusonime.kato-rest.us/api/cari/${query}`);
                const res = response.data;
                if (res.length === 0) return reject(`Pencarian ${query} tidak ditemukan!`);

                console.log('masuk')
                let page = 1;
                const animes = this.client.util.chunk(res, 10);
                const embed = new EmbedBuilder()
                    .setColor('Random')
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
                const response = await axios.get(`https://kusonime.kato-rest.us/api/anime/${endpoint}`);
                const res = response.data;
                message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${res.title}`)
                            .setColor('Random')
                            .setDescription(res.sinopsis.slice(0, 2048))
                            .setImage(res.thumbnail)
                            .addFields([
                                { name: "Japanese", value: res.japanese, inline: true },
                                { name: 'Genre', value: res.genre.map((a, i) => `[${a.name}](${a.url})`).join(', '), inline: true },
                                { name: 'Season', value: `[${res.season.name}](${res.season.url})`, inline: true },
                                { name: 'Producers', value: res.producers.join(', '), inline: true },
                                { name: 'Total Eps', value: res.total_eps, inline: true },
                                { name: 'Score', value: res.score, inline: true }
                            ])
                    ]
                });

                for (const title of res.list_download) {
                    const embed = new EmbedBuilder().setColor('Random').setAuthor({ name: title[0], url: `https://kusonime.com/${endpoint}` });

                    const temp = [];
                    for (const resolution of title[1]) temp.push(`**${resolution.resolusi}**\n${resolution.link_download.map((a, i) => `[${a.platform}](${a.link})`).join('\n')}`);

                    embed.setDescription(temp.join('\n'));
                    message.channel.send({ embeds: [embed] });
                }

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
}