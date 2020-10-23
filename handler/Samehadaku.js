const Discord = require('discord.js');
let axios = require('axios');

class Samehadaku {
    constructor(client) {
        this.client = client;
    }

    getSearch(query, message) {
        return new Promise(async (fullfill, reject) => {
            try {
                let get = await axios.get(`https://samehadaku-rest-api.herokuapp.com/search/${query}/1`);
                let data_search = get.data.results;
                if (data_search.length < 1) return message.reply(`Pencarian dengan nama **${query}** tidak ditemukan!`);

                //get endpoint
                let endpoint_search = [];
                data_search.forEach(a => {
                    endpoint_search.push(a.linkId);
                });
                console.log(endpoint_search)

                //send title results
                let embed = new Discord.MessageEmbed()
                    .setColor(this.client.warna.kato)
                    .setTitle('Hasil Pencarian')
                    .setDescription(data_search.map((a, i) => `${i + 1}. ${a.title}`).join('\n'))
                let embed_search = await message.channel.send(embed);
                let alert_search = await message.reply('pilih untuk melanjutkan!');

                let author = message.author;
                let response = await message.channel.awaitMessages((m) => m.content.toLowerCase() && m.author.id === author.id, {
                    max: 1,
                    time: 100000,
                    errors: ["time"]
                }).catch((err) => {
                    return message.reply('waktu permintaan telah habis!\nSilahkan buat Permintaan kembali!').then(t => {
                        t.delete({ timeout: 5000 });
                        embed_search.delete();
                        alert_search.delete();
                    });
                });

                const search_index = response.first().content;
                let result_search = endpoint_search[search_index - 1];
                await embed_search.delete();
                await alert_search.delete();
                await this.getDetail(result_search, message);

                fullfill();
            } catch (error) {
                reject(error);
            }
        })
    }

    getDetail(query, message) {
        return new Promise(async (fullfill, reject) => {
            try {
                let get = await axios.get(`https://samehadaku-rest-api.herokuapp.com/anime/${query}`);
                let chapterList = [];
                let dataChapter = get.data.list_episode;
                dataChapter.forEach((a, i) => {
                    chapterList.push({ title: `${i + 1}. ${a.title}`, endpoint: a.id });
                });

                //chunk array
                let page = 1;
                let chapterChunk = this.client.util.chunk(chapterList, 12);
                console.log(chapterChunk[0])
                let embed = new Discord.MessageEmbed()
                    .setColor(this.client.warna.kato)
                    .setTitle(get.data.title)
                    .setDescription(this.client.util.truncate(get.data.sinopsis))
                    .setImage(get.data.image)
                    .addField('Genre', get.data.genre.map((i) => `[${i.text}](${i.link})`).join(', '), true)
                    .addField('Judul dalam Jepang', get.data.detail.Japanese, true)
                    .addField('Status', get.data.detail.Status, true)
                    .addField('Studio', get.data.detail.Studio, true)
                    .addField('Season', get.data.detail.Season ? get.data.detail.Season : 'tidak tersedia', true)
                    .addField('Sinonim', get.data.detail.Synonyms ? get.data.detail.Synonyms : 'tidak tersedia', true)
                let embed_detail = await message.channel.send(embed);

                let embed2 = new Discord.MessageEmbed()
                    .setColor(this.client.warna.kato)
                    .setTitle('List Episode')
                    .setDescription(chapterChunk[page - 1].map(a => a.title))
                    .setFooter(`Page ${page} of ${chapterChunk.length}`)
                let embed_chapterList = await message.channel.send(embed2);
                let alert_detail = await message.reply('Pilih yang ingin didownload!');

                await embed_chapterList.react('👈')
                await embed_chapterList.react('👉')

                const backwardsFilter = (reaction, user) =>
                    reaction.emoji.name === `👈` && user.id === message.author.id;
                const forwardsFilter = (reaction, user) =>
                    reaction.emoji.name === `👉` && user.id === message.author.id;

                const backwards = embed_chapterList.createReactionCollector(backwardsFilter);
                const forwards = embed_chapterList.createReactionCollector(forwardsFilter);

                backwards.on('collect', (f) => {
                    if (page === 1) return;
                    page--;
                    embed2.setDescription(chapterChunk[page - 1].map(a => a.title));
                    embed2.setFooter(`Page ${page} of ${chapterChunk.length}`)
                    embed_chapterList.edit(embed2);
                })
                forwards.on("collect", (f) => {
                    if (page == chapterChunk.length) return;
                    page++;
                    embed2.setDescription(chapterChunk[page - 1].map(a => a.title));
                    embed2.setFooter(`Page ${page} of ${chapterChunk.length}`);
                    embed_chapterList.edit(embed2);
                });

                let author = message.author;
                let response = await message.channel.awaitMessages((m) => m.content.toLowerCase() && m.author.id === author.id, {
                    max: 1,
                    time: 100000,
                    errors: ["time"]
                }).catch((err) => {
                    return message.reply('waktu permintaan telah habis!\nSilahkan buat Permintaan kembali!')
                        .then(t => {
                            embed_detail.delete();
                            embed_chapterList.delete();
                            alert_detail.delete();
                            t.delete({ timeout: 5000 })
                        });
                });

                const index = parseInt(response.first().content);
                let result_eps = chapterList[index - 1].endpoint;
                embed_detail.delete();
                embed_chapterList.delete();
                alert_detail.delete();
                await this.getLink(result_eps, message);

                fullfill();
            } catch (error) {
                reject(error);
            }
        })
    }

    getLink(query, message) {
        return new Promise(async (fullfill, reject) => {
            try {
                let get = await axios.get(`https://samehadaku-rest-api.herokuapp.com/anime/eps/${query}`);
                let author = message.author

                let alert_link = await message.reply('Mau pilih format apa?\n1. MKV\n2. MP4\n3. x265 ');
                let response = await message.channel.awaitMessages((m) => m.content.toLowerCase() && m.author.id === author.id, {
                    max: 1,
                    time: 100000,
                    errors: ["time"]
                }).catch(err => {
                    message.reply('Waktu permintaan telah habis, silahkan buat permintaan kembali!');
                    alert_link.delete();
                });

                let index = parseInt(response.first().content);
                await alert_link.delete();

                switch (index) {
                    case 1:
                        let getMKV = get.data.downloadEps;
                        let mkvResults = getMKV.find(a => a.format === 'MKV').data;
                        let embedMKV = new Discord.MessageEmbed().setColor(this.client.warna.kato).setTitle('Format MKV');
                        for (let i = 0; i < mkvResults.length; i++) {
                            embedMKV.addField(mkvResults[i].quality, `[Klik di sini!](${mkvResults[i].link.zippyshare})`)
                        }
                        message.channel.send(embedMKV);
                        break;

                    case 2:
                        let getMP4 = get.data.downloadEps;
                        let mp4Results = getMP4.find(a => a.format === 'MP4').data;
                        let embedMP4 = new Discord.MessageEmbed().setColor(this.client.warna.kato).setTitle('Format MP4');
                        for (let i = 0; i < mp4Results.length; i++) {
                            embedMP4.addField(mp4Results[i].quality, `[Klik di sini!](${mp4Results[i].link.zippyshare})`)
                        }
                        message.channel.send(embedMP4);
                        break;

                    case 3:
                        let getx265 = get.data.downloadEps;
                        let x265results = getx265.find(a => a.format === 'x265').data;
                        if (x265results === undefined) return message.reply('ternyata tidak ada format x265 untuk anime ini :(')
                        let embedx265 = new Discord.MessageEmbed().setColor(this.client.warna.kato).setTitle('Format x265');
                        for (let i = 0; i < x265results.length; i++) {
                            embedx265.addField(x265results[i].quality, `[Klik di sini!](${x265results[i].link.zippyshare})`)
                        }
                        message.channel.send(embedx265);
                        break;
                    default:
                        message.reply('kamu memasukkan nilai yang salah, silahkan ulangi lagi dari awal!')
                        break;
                }
                fullfill();
            } catch (error) {
                reject(error);
            }
        })
    }
}


module.exports = Samehadaku;
