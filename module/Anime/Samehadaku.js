const Discord = require('discord.js');
const axios = require('axios');

module.exports = class Samehadaku {
    constructor(client) {
        this.client = client;
    }

    getWithSearch(query, message) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(`https://samehadaku-rest-api.herokuapp.com/search/${query}/1`);
                const res = response.data.results;
                if (res.length === 0) return reject(`Pencarian ${query} tidak ditemukan!`);

                const re = await message.channel.send({
                    content: `Pilih menggunakan angka!`, embeds: [
                        new Discord.MessageEmbed()
                            .setColor('RANDOM').setTitle(`Pencarian ${query}`)
                            .setDescription(res.map((a, i) => `**${i + 1}**. ${a.title}`).join('\n'))
                    ]
                });

                const collector = await message.channel.createMessageCollector({ filter: m => m.author.id === message.author.id, time: 60000 });
                collector.on('collect', async m => {
                    if (isNaN(m.content)) return message.channel.send('Pilih menggunakan angka!');
                    collector.stop();
                    re.delete();

                    const anime = res[m.content - 1];
                    await this.getDetail(anime, message);
                });

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    getDetail(anime, message) {
        return new Promise(async (resolve, reject) => {
            try {
                const endpoint = anime?.linkId.split('/')[3];
                const response = await axios.get(`https://samehadaku-rest-api.herokuapp.com/anime/${endpoint}`);
                const res = response.data;

                await message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setColor('RANDOM').setTitle(res.title)
                            .setDescription(this.client.util.truncate(res.sinopsis))
                            .setImage(res.image)
                            .addField('Genre', res.genre.map((i) => `[${i.text}](${i.link})`).join(', '), true)
                            .addField('Judul dalam Jepang', res.detail.Japanese, true)
                            .addField('Status', res.detail.Status, true)
                            .addField('Studio', res.detail.Studio, true)
                            .addField('Season', res.detail.Season ? res.detail.Season : 'tidak tersedia', true)
                            .addField('Sinonim', res.detail.Synonyms ? res.detail.Synonyms : 'tidak tersedia', true)
                    ]
                });

                const chapters = res.list_episode;
                const select = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageSelectMenu()
                            .setCustomId(`select-${message.id}`)
                            .setPlaceholder('Select Episode')
                            .addOptions(
                                chapters.map((a, i) => {
                                    return {
                                        label: a.title,
                                        description: `Episode ${a.episode} - ${a.date_uploaded}`,
                                        value: a.link.split('/')[3]
                                    }
                                })
                            )
                    );

                const r = await message.channel.send({ content: 'Pilih Episode!', components: [select] });
                const collector = r.channel.createMessageComponentCollector({
                    filter: m => m.user.id === message.author.id && m.componentType === 'SELECT_MENU', time: 60000
                });
                collector.on('collect', async (m) => {
                    await m.deferUpdate();

                    const ress = await axios.get(`https://samehadaku-rest-api.herokuapp.com/anime/eps/${m.values}`);
                    const data = ress.data;
                    for (const format of data.downloadEps) {
                        const embed = new Discord.MessageEmbed().setColor('RANDOM').setAuthor(format.format);
                        embed.setDescription(format.data.map((a, i) => {
                            const link = Object.entries(a.link);
                            const maplink = link.map((b, j) => `[${b[0]}](${b[1]})`).join('\n');

                            return `**${a.quality}**\n${maplink}`;
                        }).join('\n'));

                        message.channel.send({ embeds: [embed] });
                    }

                    collector.stop();
                });
                // const embed = new Discord.MessageEmbed()
                //     .setColor('RANDOM').setTitle('Episode List')
                //     .setDescription(chapters[pagination - 1].map((a, i) => `**${i + 1}**. ${a.title}`).join('\n'))
                //     .setFooter(`Page ${pagination} of ${chapters.length}`);

                // const buttons = new Discord.MessageActionRow()
                //     .addComponents(
                //         new Discord.MessageButton()
                //             .setLabel('< Back').setStyle('SECONDARY')
                //             .setCustomId(`back-${message.id}`),
                //         new Discord.MessageButton()
                //             .setLabel('Next >').setStyle('SECONDARY')
                //             .setCustomId(`next-${message.id}`)
                //     )
                // const chapterMsg = await message.channel.send({ embeds: [embed], components: [buttons] });
                // const collecotr = chapterMsg.channel.createMessageComponentCollector()

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
}