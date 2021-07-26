const Discord = require('discord.js');
const axios = require('axios');
const { MessageButton } = require('discord-buttons');
class Kusonime {
    constructor(client) {
        this.client = client;
    }

    getBySearch(query, message) {
        return new Promise(async (fullfill, reject) => {
            try {

                const response = await axios.get(`http://posantai.bugs.today/kusonime/api/cari/${query}`);
                const data = response.data;

                if (data.length === 0) return message.reply(`Tidak ditemukan dengan teks ${query}!`)
                let chunk = this.client.util.chunk(data, 5);
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Hasil Pencarian dari ${query}`)
                    .setColor(this.client.warna.kato)
                    .setDescription(chunk[0].map((a, i) => `${i + 1}. ${a.title}`).join('\n'))

                let mEmbed = await message.channel.send(embed);
                let alertBed = await message.reply('pilih untuk melanjutkan!');

                let req = message.author;
                let request = await message.channel.awaitMessages((m) => m.content.toLowerCase() && m.author.id === req.id, {

                    max: 1,
                    time: 100000,
                    errors: ["time"]

                }).catch((err) => {

                    mEmbed.delete();
                    alertBed.delete();
                    message.channel.send('permintaan telah habis, silahkan buat permintaan kembali!').then(t => t.delete({ timeout: 5000 }));

                });

                const answer = request.first().content;
                this.getDetail(chunk[0][answer - 1].link.endpoint, message);
                fullfill(chunk[0][answer - 1].link.endpoint);

                await mEmbed.delete();
                await alertBed.delete();

            } catch (err) {
                reject(err);
                message.channel.send(err.message);
            };


        });
    };

    getDetail(query, message) {
        return new Promise(async (fullfill, reject) => {
            try {

                const response = await axios.get(`http://posantai.bugs.today/kusonime/api/anime/${query}`);
                const data = response.data;

                let embed = new Discord.MessageEmbed()
                    .setTitle(data.title)
                    .setColor(this.client.warna.kato)
                    .setDescription(data.sinopsis.slice(0, 2048))
                    .setImage(data.thumbnail)
                    .addField("Japanese", data.japanese, true)
                    .addField('Genre', data.genre.map((a, i) => `[${a.name}](${a.url})`).join(', '), true)
                    .addField('Season', `[${data.season.name}](${data.season.url})`, true)
                    .addField('Producers', data.producers.join(', '), true)
                    .addField('Total Eps', data.total_eps, true)
                    .addField('Score', data.score, true)

                await message.channel.send(embed)
                // res.list_download.map((a) => `*${a[0]}*\n${a[1].map(b => `*${b.resolusi}*\n${b.link_download.map(c => `├${c.platform}\n${c.link}`).join('\n')}`).join('\n')}`)
                // let link_data = data.list_download.map((a, i) => `${a.resolusi}\n${a.link_download.map((a, i) => `[${a.platform}](${a.link})`).join('\n')}\n`);
                // link_data = this.client.util.chunk(link_data, 2);
                for (let eachTitle of data.list_download) {

                    const temp = [];
                    const dlEmbed = new Discord.MessageEmbed()
                        .setColor(this.client.warna.kato)
                        .setAuthor(eachTitle[0], undefined, 'https://kusonime.com/' + query);

                    for (let eachResolution of eachTitle[1]) {
                        const tRes = `**${eachResolution.resolusi}**\n${eachResolution.link_download.map((a, i) => `[${a.platform}](${a.link})`).join('\n')}`;
                        temp.push(tRes);
                    }

                    dlEmbed.setDescription(temp);
                    message.channel.send(dlEmbed);

                }


            } catch (error) {

                reject(error);
                message.channel.send(error.message);

            }


        });
    };

};

/** ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

class Samehadaku {
    constructor(client) {
        this.client = client;
    }

    getSearch(query, message) {
        return new Promise(async (fullfill, reject) => {
            try {
                const get = await axios.get(`https://samehadaku-rest-api.herokuapp.com/search/${query}/1`);
                const res = get.data.results;
                if (res.length < 1) return message.reply(`Pencarian dengan nama **${query}** tidak ditemukan!`);

                //send title results
                const embed = new Discord.MessageEmbed()
                    .setColor(this.client.warna.kato)
                    .setTitle('Hasil Pencarian')
                    .setDescription(res.map((a, i) => `${i + 1}. ${a.title}`).join('\n'))
                const embedSearch = await message.channel.send(embed);
                const alertSearch = await message.reply('pilih untuk melanjutkan!');

                const response = await message.channel.awaitMessages((m) => m.content.toLowerCase() && m.author.id === message.author.id, {
                    max: 1,
                    time: 100000,
                    errors: ["time"]
                }).catch((err) => {
                    return message.reply('waktu permintaan telah habis!\nSilahkan buat Permintaan kembali!').then(t => {
                        t.delete({ timeout: 5000 });
                        embedSearch.delete();
                        alertSearch.delete();
                    });
                });

                await embedSearch.delete();
                await alertSearch.delete();

                const index = response.first().content;
                await this.getDetail(res[index - 1], message);

                fullfill();
            } catch (error) {
                reject(error);
            }
        })
    }

    getDetail(query, message) {
        return new Promise(async (fullfill, reject) => {
            try {
                query = query.linkId.replace('https:/samehadaku.to/anime/', '');
                const get = await axios.get(`https://samehadaku-rest-api.herokuapp.com/anime/${query}`);
                const res = get.data;

                //chunk array
                const chapterChunk = this.client.util.chunk(res.list_episode, 10);
                const embede = new Discord.MessageEmbed()
                    .setColor(this.client.warna.kato)
                    .setTitle(res.title)
                    .setDescription(this.client.util.truncate(res.sinopsis))
                    .setImage(res.image)
                    .addField('Genre', res.genre.map((i) => `[${i.text}](${i.link})`).join(', '), true)
                    .addField('Judul dalam Jepang', res.detail.Japanese, true)
                    .addField('Status', res.detail.Status, true)
                    .addField('Studio', res.detail.Studio, true)
                    .addField('Season', res.detail.Season ? res.detail.Season : 'tidak tersedia', true)
                    .addField('Sinonim', res.detail.Synonyms ? res.detail.Synonyms : 'tidak tersedia', true)
                const embedDetail = await message.channel.send(embede);


                let pagination = 1;
                const embed = new Discord.MessageEmbed()
                    .setColor(this.client.warna.kato)
                    .setTitle('List Episode')
                    .setDescription(chapterChunk[pagination - 1].map(a => a.title))
                    .setFooter(`Page ${pagination} of ${chapterChunk.length}`)

                const backwardsButton = new MessageButton().setStyle('grey').setLabel('< Back').setID('backID');
                const forwadsButton = new MessageButton().setStyle('grey').setLabel('Next >').setID('nextID');
                const buttonList = [backwardsButton, forwadsButton];

                const r = await message.channel.send({ embed, buttons: this.client.util.buttonPageFilter(buttonList, chapterChunk.length, pagination) });

                const collector = r.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 500000 });
                collector.on('collect', button => {
                    button.reply.defer();
                    switch (button.id) {
                        case 'backID':
                            if (pagination === 1) return;
                            pagination--;
                            embed.setDescription(chapterChunk[pagination - 1].map(a => a.title));
                            embed.setFooter(`Page ${pagination} of ${chapterChunk.length}`);
                            r.edit({ embed, buttons: this.client.util.buttonPageFilter(buttonList, chapterChunk.length, pagination) });
                            break;

                        case 'nextID':
                            if (pagination === chapterChunk.length) return;
                            pagination++;
                            embed.setDescription(chapterChunk[pagination - 1].map(a => a.title));
                            embed.setFooter(`Page ${pagination} of ${chapterChunk.length}`);
                            r.edit({ embed, buttons: this.client.util.buttonPageFilter(buttonList, chapterChunk.length, pagination) });
                            break;
                    };
                });

                const alertDetail = await message.reply('Pilih yang ingin didownload!');
                let response = await message.channel.awaitMessages((m) => m.content.toLowerCase() && m.author.id === message.author.id, {
                    max: 1,
                    time: 100000,
                    errors: ["time"]
                }).catch((err) => {
                    return message.reply('waktu permintaan telah habis!\nSilahkan buat Permintaan kembali!')
                        .then(t => {
                            embedDetail.delete();
                            r.delete();
                            alertDetail.delete();
                            t.delete({ timeout: 5000 })
                        });
                });

                const index = parseInt(response.first().content);
                r.delete();
                alertDetail.delete();
                await this.getLink(res.list_episode[index - 1], message);

                fullfill();
            } catch (error) {
                reject(error);
            }
        })
    }

    getLink(query, message) {
        return new Promise(async (fullfill, reject) => {
            try {
                query = query.id.replace('https://samehadaku.to/', '');
                const res = await axios.get(`https://samehadaku-rest-api.herokuapp.com/anime/eps/${query}`);
                const data = res.data;

                for (const format of data.downloadEps) {
                    const embed = new Discord.MessageEmbed().setColor(this.client.warna.kato).setAuthor(format.format);
                    embed.setDescription(format.data.map((a, i) => {
                        const link = Object.entries(a.link);
                        const maplink = link.map((b, j) => `[${b[0]}](${b[1]})`).join('\n');

                        return `**${a.quality}**\n${maplink}`;
                    }));
                    message.channel.send(embed);
                }
                fullfill();
            } catch (error) {
                reject(error);
            }
        })
    }
}

/** ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

class MangaDex {
    constructor(client) {
        this.client = client
    }

    getInformation(query, lang, message) {
        return new Promise(async (fullfill, reject) => {
            try {
                await login;
                var manga = new api.Manga();
                manga.fillByQuery(query).then(async (manga) => {
                    //information about manga
                    let embed = new Discord.MessageEmbed()
                        .setColor(this.client.warna.kato)
                        .setAuthor(manga.title, 'https://mangadex.org/images/misc/default_brand.png?1', manga.url)
                        .setThumbnail('https://mangadex.org/' + manga.cover)
                        .addField('Genre', manga.genreNames.join(', '), true)
                        .addField('Artist & Authors', manga.authors, true)
                        .addField('Rating', `⭐${manga.rating}`, true)
                        .addField('Hentai', manga.hentai, true)
                        .addField('ID', manga.id, true)
                        .addField('Language', lang ? lang : 'GB', true)
                    let m_info = await message.channel.send(embed);

                    //chapter_list
                    let filters = manga.chapters.filter(function (v) {
                        return v.language == lang;
                    });
                    if (filters.length < 1) return message
                        .reply(`\`${query}\` Chapters with \`${lang}\` Language, Not Found!`)
                        .then(t => {
                            m_info.delete();
                            t.delete({ timeout: 5000 });
                        });
                    let array_chapter = [];
                    filters.forEach((a, i) => {
                        array_chapter.push(`**${1 + i}.** **Chapter ${a.chapter} (${a.id})**`)
                    });

                    //chunk array
                    let title_chunk = this.client.util.chunk(array_chapter, 15);

                    //embed
                    let pagination = 1;
                    let embede = new Discord.MessageEmbed()
                        .setColor(this.client.warna.kato)
                        .setTitle('Chapter List')
                        .setDescription(title_chunk[pagination - 1])
                    let m_chap = await message.channel.send(embede);
                    await m_chap.react('👈'); //geser chapter list
                    await m_chap.react('📖'); //read
                    await m_chap.react('♻');  //delete
                    await m_chap.react('👉'); // geser chapter list

                    let m_alert = await message.reply(`**👈 : Backwards\n📖 : Read\n♻ : Delete\n👉 : Forwards**`)
                    //emoji collector
                    const backwardsFilter = (reaction, user) =>
                        reaction.emoji.name === `👈` && user.id === message.author.id;
                    const ReadManga = (reaction, user) =>
                        reaction.emoji.name === `📖` && user.id === message.author.id;
                    const deleteEmbed = (reaction, user) =>
                        reaction.emoji.name === `♻` && user.id === message.author.id;
                    const forwardsFilter = (reaction, user) =>
                        reaction.emoji.name === `👉` && user.id === message.author.id;
                    const backwards = m_chap.createReactionCollector(backwardsFilter);
                    const read = m_chap.createReactionCollector(ReadManga);
                    const embedDelete = m_chap.createReactionCollector(deleteEmbed);
                    const forwards = m_chap.createReactionCollector(forwardsFilter);

                    backwards.on('collect', (f) => {
                        if (pagination === 1) return;
                        pagination--;
                        embede.setDescription(title_chunk[pagination - 1]);
                        embede.setFooter(`Page ${pagination} of ${title_chunk.length}`)
                        m_chap.edit(embede)

                    });

                    read.on('collect', (f) => {
                        m_chap.delete()
                        m_info.delete()
                        m_alert.delete()
                        this.getChapterList(query, lang, message)
                    })
                    embedDelete.on('collect', (f) => {
                        m_info.delete();
                        m_chap.delete();
                        m_alert.delete();
                    });

                    forwards.on("collect", (f) => {
                        if (pagination == title_chunk.length) return;
                        pagination++;
                        embede.setDescription(title_chunk[pagination - 1]);
                        embede.setFooter(`Page ${pagination} of ${title_chunk.length}`);
                        m_chap.edit(embede);
                    });
                });
                fullfill();
            } catch (error) {
                reject(error)
            }
        })
    }

    getChapterList(query, lang, message) {
        return new Promise(async (fullfill, reject) => {
            try {
                await login;
                var manga = new api.Manga();
                manga.fillByQuery(query).then(async (manga) => {

                    let filters = manga.chapters.filter(function (v) {
                        return v.language == lang;
                    });
                    if (filters === undefined) return message.reply(`${query} with lang ${lang}, Not Found!`)
                    let array_chapter = [];
                    filters.forEach((a, i) => {
                        array_chapter.push(`**${1 + i}.** **Chapter ${a.chapter} | ${a.id}**`)
                    });

                    //chunk array
                    let title_chunk = this.client.util.chunk(array_chapter, 15);

                    //embed
                    let pagination = 1;
                    let embede = new Discord.MessageEmbed()
                        .setColor(this.client.warna.kato)
                        .setTitle('Chapter List')
                        .setDescription(title_chunk[pagination - 1])
                    let m_chap = await message.channel.send(embede);
                    await m_chap.react('👈');
                    await m_chap.react('👉');

                    //emoji collector
                    const backwardsFilter = (reaction, user) =>
                        reaction.emoji.name === `👈` && user.id === message.author.id;
                    const forwardsFilter = (reaction, user) =>
                        reaction.emoji.name === `👉` && user.id === message.author.id;
                    const backwards = m_chap.createReactionCollector(backwardsFilter);
                    const forwards = m_chap.createReactionCollector(forwardsFilter);

                    backwards.on('collect', (f) => {
                        if (pagination === 1) return;
                        pagination--;
                        embede.setDescription(title_chunk[pagination - 1]);
                        embede.setFooter(`Page ${pagination} of ${title_chunk.length}`)
                        m_chap.edit(embede)

                    });

                    forwards.on("collect", (f) => {
                        if (pagination == title_chunk.length) return;
                        pagination++;
                        embede.setDescription(title_chunk[pagination - 1]);
                        embede.setFooter(`Page ${pagination} of ${title_chunk.length}`);
                        m_chap.edit(embede);
                    });

                    //alert + response await message
                    let m_alert = await message.reply('choose the chapter to continue')
                    let response = await message.channel.awaitMessages((m) => m.content > 0 && m.content <= 1000, {
                        max: 1,
                        time: 100000,
                        errors: ["time"]
                    }).catch((err) => {
                        return message.reply('waktu permintaan telah habis!\nSilahkan buat Permintaan kembali!')
                            .then(t => {
                                m_chap.delete()
                                m_alert.delete()
                                t.delete({ timeout: 5000 })
                            })
                    })

                    const getContent = parseInt(response.first().content);
                    let array_response = array_chapter[getContent - 1].split('**')[3].split('|')[1].trim()
                    await m_chap.delete();
                    await m_alert.delete();
                    this.getReadWithChapterList(array_response, query, lang, message)


                })
                fullfill();
            } catch (err) {
                reject(err)
            }
        })
    };

    getReadWithID(query, message) {
        return new Promise(async (fullfill, reject) => {
            try {
                //get data
                await login;
                var manga = await new api.Chapter(query, true)

                //image
                let pagination = 1
                let array_image = manga.saverPages

                //embed
                let embed = new Discord.MessageEmbed()
                    .setColor(this.client.warna.kato)
                    .setAuthor(manga.title, '', manga.link)
                    .setImage(array_image[pagination - 1])
                    .setFooter(`Page ${pagination} of ${array_image.length} | id: ${manga.id}`)
                let r = await message.channel.send(embed)
                r.react('👈');
                r.react('♻');
                r.react('💾')
                r.react('👉');

                //emoji collector
                const backwardsFilter = (reaction, user) =>
                    reaction.emoji.name === `👈` && user.id === message.author.id;
                const deleteEmbed = (reaction, user) =>
                    reaction.emoji.name === `♻` && user.id === message.author.id;
                const download = (reaction, user) =>
                    reaction.emoji.name === `💾` && user.id === message.author.id;
                const forwardsFilter = (reaction, user) =>
                    reaction.emoji.name === `👉` && user.id === message.author.id;
                const backwards = r.createReactionCollector(backwardsFilter);
                const DeleteEmbed = r.createReactionCollector(deleteEmbed);
                const dl = r.createReactionCollector(download)
                const forwards = r.createReactionCollector(forwardsFilter);

                backwards.on('collect', (f) => {
                    if (pagination === 1) return;
                    pagination--;
                    embed.setImage(array_image[pagination - 1]);
                    embed.setFooter(`Page ${pagination} of ${array_image.length}`)
                    r.edit(embed)

                });

                DeleteEmbed.on('collect', (f) => {
                    r.delete()
                });

                dl.on('collect', (f) => {
                    let embed = new Discord.MessageEmbed()
                        .setColor(this.client.warna.kato)
                        .setTitle('MangaDL')
                        .addField('zip', `[download here](http://206.189.91.238/download/mangadex/${manga.id}/zip)`)
                        .addField('cbz', `[download here](http://206.189.91.238/download/mangadex/${manga.id}/cbz)`)
                    message.channel.send('this message will be deleted in 10 seconds', embed).then(t => t.delete({ timeout: 10000 }))
                })

                forwards.on("collect", (f) => {
                    if (pagination == array_image.length) return;
                    pagination++;
                    embed.setImage(array_image[pagination - 1]);
                    embed.setFooter(`Page ${pagination} of ${array_image.length}`);
                    r.edit(embed);
                });


                fullfill();
            } catch (err) {
                reject(err)
            }
        })
    }
    getReadWithChapterList(query, data, lang, message) {
        return new Promise(async (fullfill, reject) => {
            try {
                //get data
                await login;
                var manga = await new api.Chapter(query, true)

                //image
                let pagination = 1
                let array_image = manga.saverPages

                //embed
                let embed = new Discord.MessageEmbed()
                    .setColor(this.client.warna.kato)
                    .setAuthor(manga.title, '', manga.link)
                    .setImage(array_image[pagination - 1])
                    .setFooter(`Page ${pagination} of ${array_image.length} | id: ${manga.id}`)
                let r = await message.channel.send(embed)
                r.react('👈');
                r.react('♻');
                r.react('⭕');
                r.react('💾')
                r.react('👉');

                //emoji collector
                const backwardsFilter = (reaction, user) =>
                    reaction.emoji.name === `👈` && user.id === message.author.id;
                const deleteEmbed = (reaction, user) =>
                    reaction.emoji.name === `♻` && user.id === message.author.id;
                const chapterList = (reaction, user) =>
                    reaction.emoji.name === `⭕` && user.id === message.author.id;
                const download = (reaction, user) =>
                    reaction.emoji.name === `💾` && user.id === message.author.id;
                const forwardsFilter = (reaction, user) =>
                    reaction.emoji.name === `👉` && user.id === message.author.id;
                const backwards = r.createReactionCollector(backwardsFilter);
                const DeleteEmbed = r.createReactionCollector(deleteEmbed);
                const ChapterList = r.createReactionCollector(chapterList);
                const dl = r.createReactionCollector(download)
                const forwards = r.createReactionCollector(forwardsFilter);

                backwards.on('collect', (f) => {
                    if (pagination === 1) return;
                    pagination--;
                    embed.setImage(array_image[pagination - 1]);
                    embed.setFooter(`Page ${pagination} of ${array_image.length}`)
                    r.edit(embed)

                });

                DeleteEmbed.on('collect', (f) => {
                    r.delete()
                });

                ChapterList.on('collect', (f) => {
                    r.delete()
                    this.getChapterList(data, lang, message)
                });

                dl.on('collect', (f) => {
                    let embed = new Discord.MessageEmbed()
                        .setColor(this.client.warna.kato)
                        .setTitle('MangaDL')
                        .addField('zip', `[download here]((https://mangadl-katow.herokuapp.com/download/mangadex/${manga.id}/zip)`)
                        .addField('cbz', `[download here]((https://mangadl-katow.herokuapp.com/download/mangadex/${manga.id}/cbz)`)
                    message.channel.send('this message will be deleted in 10 seconds', embed).then(t => t.delete({ timeout: 10000 }))
                })

                forwards.on("collect", (f) => {
                    if (pagination == array_image.length) return;
                    pagination++;
                    embed.setImage(array_image[pagination - 1]);
                    embed.setFooter(`Page ${pagination} of ${array_image.length}`);
                    r.edit(embed);
                });


                fullfill();
            } catch (err) {
                reject(err)
            }
        })
    };
};

module.exports = { Kusonime, Samehadaku };