const Discord = require('discord.js');
const api = require('mangadex-full-api');
const account = require('../config/config.json').mangadex.account;
const login = api.agent.cacheLogin('cache.txt', account.username, account.password)

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
    };
};
module.exports = MangaDex