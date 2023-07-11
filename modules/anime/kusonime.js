const axios = require('axios');
const { EmbedBuilder, Message } = require('discord.js');

module.exports = class Kusonime {
    constructor(client) {
        this.client = client;
    }

    /**
     * 
     * @param {String} query 
     * @param {Message} message 
     * @returns Promise<void>
     */
    getWithSearch(query, message) {
        return new Promise(async (resolve, reject) => {
            try {
                let page = 1;
                const { data } = await axios.get(`https://kusonime.katowproject.app/api/search/page/${page}/?s=${query}`);
                const res = data?.data.listAnime;
                if (res?.length === 0) return message.reply('Tidak ada hasil yang ditemukan!');

                const anime = res.map((a, i) => `**${i + 1}.** [${a.title}](${a.url})`).join('\n');
                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setDescription(anime);

                const r = await message.channel.send({ content: 'Pilih menggunakan angka!', embeds: [embed] });
                const collector = message.channel.createMessageCollector({ filter: m => m.author.id === message.author.id, time: 20000 });
                collector.on('collect', async (f) => {
                    if (['cancel', 'gk jadi', 'gak jadi'].includes(f.content.toLowerCase())) {
                        collector.stop();
                        return message.reply('Permintaan dibatalkan!');
                    }
                    if (isNaN(f.content)) return message.reply('Permintaan invalid, gunakanlah angka!');

                    r.delete();
                    collector.stop();

                    const index = parseInt(f.content) - 1;
                    await this.getDetail(message, res[index]);
                });
            } catch (e) {
                reject(new Error(e.message));
                console.log(e);
            }
        });
    }

    getDetail(message, anime) {
        return new Promise(async (resolve, reject) => {
            try {
                const endpoint = anime.endpoint;
                const { data } = await axios.get(`https://kusonime.katowproject.app/api/anime/${endpoint}`);
                const res = data.data;

                message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${res.title}`)
                            .setURL(`https://kusonime.com/${endpoint}`)
                            .setColor('Random')
                            .setDescription(res.sinopsis.slice(0, 2048))
                            .setImage(res.thumbnail)
                            .addFields([
                                { name: "Japanese", value: res.japanese, inline: true },
                                { name: 'Genre', value: res.genre, inline: true },
                                { name: 'Season', value: res.seasons, inline: true },
                                { name: 'Producers', value: res.producers, inline: true },
                                { name: 'Total Eps', value: res.total_episode, inline: true },
                                { name: 'Score', value: res.score, inline: true }
                            ])
                    ]
                });
                for (const anime of res.list_download) {
                    const resolutions = [];
                    for (const resolution of anime.download_link) {
                        const links = [];
                        for (const link of resolution.links) {
                            links.push(`[${link.name}](${link.url})`);
                        }

                        resolutions.push(`**${resolution.type}**\n${links.join(' | ')}`);
                    }

                    const embed = new EmbedBuilder()
                        .setAuthor({ name: anime.title, url: anime.url })
                        .setColor('Random')
                        .setDescription(resolutions.join('\n'));

                    message.channel.send({ embeds: [embed] });
                }

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
}