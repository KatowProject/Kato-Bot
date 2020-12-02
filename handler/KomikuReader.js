
const Discord = require('discord.js');
class Komiku {
    constructor(client) {
        this.client = client;
    }


    getGenre(query, message) {
        return new Promise(async (fullfill, reject) => {
            //mendapatkan data lebih dari satu 
            let getOne = await require('node-superfetch').get(`https://mangadl-katow.herokuapp.com/komiku/genres/${query}1`)
            let getTwo = await require('node-superfetch').get(`https://mangadl-katow.herokuapp.com/komiku/genres/${query}2`)

            let get = getOne.body.manga_list && getTwo.body.manga_list ? getOne.body.manga_list.concat(getTwo.body.manga_list) : [];
            try {
                //dapatin string judul untuk melihat informasi pada embed
                let array_title = [];
                get.forEach((a, i) => {
                    array_title.push(`**${i + 1}**. **${a.title}**`)
                })
                //console.log(array_title)

                //supaya enak dilihat gk panjang lebar, difilter dulu jadi per page 10 data
                let title_chunk = this.client.util.chunk(array_title, 10)

                //dapatin string endpoint buat melanjutkan ke message selanjutnya
                let array_endpoint = [];
                get.forEach(a => {
                    array_endpoint.push(a.endpoint)
                })
                //console.log(array_endpoint)


                //langsung berikan datanya ke user
                let pagination = 1
                let embed = new Discord.MessageEmbed()
                    .setColor(this.client.warna.kato)
                    .setTitle(`Manga dengan genre ${query.replace('/', '')}`)
                    .setDescription(title_chunk[pagination - 1])
                    .setFooter(`Page ${pagination} of ${title_chunk.length}`)
                let r = await message.channel.send(embed)
                await r.react('👈')
                await r.react('👉')



                const backwardsFilter = (reaction, user) =>
                    reaction.emoji.name === `👈` && user.id === message.author.id;
                const forwardsFilter = (reaction, user) =>
                    reaction.emoji.name === `👉` && user.id === message.author.id;



                const backwards = r.createReactionCollector(backwardsFilter);
                const forwards = r.createReactionCollector(forwardsFilter);



                backwards.on('collect', (f) => {
                    if (pagination === 1) return;
                    pagination--;
                    embed.setDescription(title_chunk[pagination - 1]);
                    embed.setFooter(`Page ${pagination} of ${title_chunk.length}`)
                    r.edit(embed);

                })

                forwards.on("collect", (f) => {
                    if (pagination == title_chunk.length) return;
                    pagination++;
                    embed.setDescription(title_chunk[pagination - 1]);
                    embed.setFooter(`Page ${pagination} of ${title_chunk.length}`);
                    r.edit(embed);
                });

                //bot meminta data selanjutnya kepada user untuk melanjutkan
                let reply = await message.reply('pilih untuk melihat detailnya!')
                let response = await message.channel.awaitMessages((m) => m.content > 0 && m.content <= 1000, {
                    max: 1,
                    time: 100000,
                    errors: ["time"]
                }).catch((err) => {
                    return message.reply('waktu permintaan telah habis!\nSilahkan buat Permintaan kembali!')
                        .then(t => {
                            r.delete()
                            t.delete({ timeout: 5000 })
                        })
                })

                const index = parseInt(response.first().content);
                let t = array_endpoint[index - 1]
                await r.delete()
                await reply.delete()
                await this.getDetail(t, message)

                fullfill()
            } catch (err) {
                reject(err)
            }
        })
    }

    getDetail(query, message) {
        return new Promise(async (fullfill, reject) => {

            let get = await require('node-superfetch').get(`https://mangadl-katow.herokuapp.com/komiku/manga/detail/${query}`)

            try {
                //genrelist
                let array = [];
                let json = get.body.genre_list
                json.forEach(a => {
                    array.push(a.genre_name)
                })
                //
                let embed = new Discord.MessageEmbed()
                    .setColor(this.client.warna.kato)
                    .setTitle(get.body.title)
                    .setThumbnail(get.body.thumb)
                    .addField('Genre', array.join(', '), true)
                    .addField('Status', get.body.status, true)
                    .addField('Tipe', get.body.type, true)
                    .addField('Author', get.body.author, true)
                    .addField('Endpoint', get.body.manga_endpoint, true)
                    .setDescription(get.body.synopsis.slice(0, 2048))
                let p = await message.channel.send(embed)

                //chapter
                let chap = [];
                let json_c = get.body.chapter
                json_c.forEach((a, i) => {
                    chap.push(`**${i + 1}**. **${a.chapter_title}**`)
                })
                let page = 1;

                let chap_ = this.client.util.chunk(chap, 10)
                let embede = new Discord.MessageEmbed()
                    .setColor(this.client.warna.kato)
                    .setTitle('Chapter List')
                    .setDescription(chap_[page - 1])
                    .setFooter(`Page ${page} of ${chap_.length}`)
                let r = await message.channel.send(embede)
                await message.reply(`Cara untuk membaca, \`${this.client.discord.config.prefix.join(' || ')}read <Endpoint>\``)
                await r.react("⬅");
                await r.react("♻");
                await r.react("➡");

                const backwardsFilter = (reaction, user) =>
                    reaction.emoji.name === `⬅` && user.id === message.author.id;
                const deleteFilter = (reaction, user) =>
                    reaction.emoji.name === `♻` && user.id === message.author.id;
                const forwardsFilter = (reaction, user) =>
                    reaction.emoji.name === `➡` && user.id === message.author.id;


                const backwards = r.createReactionCollector(backwardsFilter);
                const deletes = r.createReactionCollector(deleteFilter);
                const forwards = r.createReactionCollector(forwardsFilter);

                backwards.on('collect', (f) => {
                    if (page === 1) return;
                    page--;
                    embede.setDescription(chap_[page - 1]);
                    embede.setFooter(`Page ${page} of ${chap_.length}`)
                    r.edit(embede);

                })

                forwards.on("collect", (f) => {
                    if (page == chap.length) return;
                    page++;
                    embede.setDescription(chap_[page - 1]);
                    embede.setFooter(`Page ${page} of ${chap_.length}`);
                    r.edit(embede);
                });

                deletes.on('collect', (f) => {
                    r.delete()
                    p.delete()
                })

                fullfill();
            } catch (err) {
                reject(err)
            }

        })

    }

    getBySearch(query, message) {
        return new Promise(async (fullfill, reject) => {
            try {
                //get data manga
                let get = await require('node-superfetch').get(`https://mangadl-katow.herokuapp.com/komiku/cari/${query}`)
                //

                //get result
                const json = get.body
                var data_array = [];
                json.forEach((a, i) => {
                    data_array.push(`**${i + 1}.** **${a.title}**\n\`Endpoint: ${a.endpoint.split('-').join(' ')}\``)
                });

                //

                //get await endpoint
                const json_e = get.body
                var data_endpoint = [];
                json_e.forEach((a, i) => {
                    data_endpoint.push(a.endpoint)
                });

                if (json.length == 0) return message.reply(`tidak ditemukan komik berjudul \`${query}\``).then(t => t.delete({ timeout: 5000 }));
                let embed = new Discord.MessageEmbed()
                    .setColor(this.client.warna.kato)
                    .setTitle('Hasil Pencarian')
                    .setDescription(data_array)
                    .setFooter('Cara membaca k!read <endpoint>')
                let r = await message.channel.send(embed);
                let p = await message.reply('pilih yang ingin dibaca!');

                let response = await message.channel.awaitMessages((m) => m.content > 0 && m.content <= 1000, {
                    max: 1,
                    time: 100000,
                    errors: ["time"]
                }).catch((err) => {
                    return message.reply('waktu permintaan telah habis!\nSilahkan buat Permintaan kembali!')
                        .then(t => {
                            r.delete()
                            t.delete({ timeout: 5000 })
                            p.delete()
                        })
                })

                const index = parseInt(response.first().content);
                let t = data_endpoint[index - 1]
                await r.delete()
                await p.delete()

                this.getChapList(t, message)
                fullfill();

            } catch (err) {
                reject(err)
            }
        });

    }

    getChapList(query, message) {
        return new Promise(async (fullfill, reject) => {
            let get = await require('node-superfetch').get(`https://mangadl-katow.herokuapp.com/komiku/manga/detail/${query}`)
            try {
                //get Chap
                let chap = [];
                let json_c = get.body.chapter
                json_c.forEach(a => {
                    chap.push(a.chapter_title)
                })
                let page = 1;

                let chap_ = chap.map((title, i) => {
                    return `** ${i + 1}.** **${title}**`
                });
                //

                //get endpoint
                let ep = [];
                let json_ep = get.body.chapter
                json_ep.forEach(a => {
                    ep.push(a.chapter_endpoint)
                });


                chap_ = this.client.util.chunk(chap_, 10)
                let embede = new Discord.MessageEmbed()
                    .setColor(this.client.warna.kato)
                    .setTitle(`${get.body.title} Chapter List`)
                    .setDescription(chap_[page - 1])
                    .setFooter(`Page ${page} of ${chap_.length}`)
                let r = await message.channel.send(embede)
                let p = await message.reply('pilih yang ingin dibaca!')

                await r.react("👈");
                await r.react("👉");



                const backwardsFilter = (reaction, user) =>
                    reaction.emoji.name === `👈` && user.id === message.author.id;
                const forwardsFilter = (reaction, user) =>
                    reaction.emoji.name === `👉` && user.id === message.author.id;



                const backwards = r.createReactionCollector(backwardsFilter);
                const forwards = r.createReactionCollector(forwardsFilter);



                backwards.on('collect', (f) => {
                    if (page === 1) return;
                    page--;
                    embede.setDescription(chap_[page - 1]);
                    embede.setFooter(`Page ${page} of ${chap_.length}`)
                    r.edit(embede);

                })

                forwards.on("collect", (f) => {
                    if (page == chap.length) return;
                    page++;
                    embede.setDescription(chap_[page - 1]);
                    embede.setFooter(`Page ${page} of ${chap_.length}`);
                    r.edit(embede);
                });


                let response = await message.channel.awaitMessages((m) => m.content > 0 && m.content <= 1000, {
                    max: 1,
                    time: 500000,
                    errors: ["time"]
                }).catch((err) => {
                    message.reply('waktu permintaan telah habis!\nSilahkan buat Permintaan kembali!')
                })

                const index = parseInt(response.first().content);
                let t = ep[index - 1]
                let tt = chap[index - 1]
                await r.delete()
                await p.delete()
                this.getReadEmbed(t, message, query, tt)

                fullfill();
            } catch (err) {
                reject(err)
            }
        })
    }

    getReadEmbed(query, message, data, judul) {
        return new Promise(async (fullfill, reject) => {
            try {
                let get = await require('node-superfetch').get(`https://mangadl-katow.herokuapp.com/komiku/chapter/${query}`)
                let gambar = [];
                let pagination = 1;
                let json = get.body.chapter_image;


                json.forEach((a, i) => {
                    gambar.push(`${a.chapter_image_link}`)
                })

                try {
                    let embed = new Discord.MessageEmbed()
                        .setColor(this.client.warna.kato)
                        .setTitle(judul)
                        .setImage(gambar[0])
                        .setFooter(`Page ${pagination} of ${gambar.length}`)
                    let r = await message.channel.send(embed)

                    await r.react("🤛");
                    await r.react("👈");
                    await r.react('⭕');
                    await r.react("👉");
                    await r.react("🤜");
                    await r.react("♻");
                    await r.react('💾');


                    const backwardsFiveFilter = (reaction, user) =>
                        reaction.emoji.name === '🤛' && user.id === message.author.id;
                    const backwardsFilter = (reaction, user) =>
                        reaction.emoji.name === `👈` && user.id === message.author.id;
                    const deleteFilter = (reaction, user) =>
                        reaction.emoji.name === `♻` && user.id === message.author.id;
                    const ChapFilter = (reaction, user) =>
                        reaction.emoji.name === '⭕' && user.id === message.author.id;
                    const download = (reaction, user) =>
                        reaction.emoji.name === '💾' && user.id === message.author.id;
                    const forwardsFilter = (reaction, user) =>
                        reaction.emoji.name === `👉` && user.id === message.author.id;
                    const forwardsFiveFilter = (reaction, user) =>
                        reaction.emoji.name === '🤜' && user.id === message.author.id;

                    const Fivebackwards = r.createReactionCollector(backwardsFiveFilter);
                    const backwards = r.createReactionCollector(backwardsFilter);
                    const deletes = r.createReactionCollector(deleteFilter);
                    const chaps = r.createReactionCollector(ChapFilter);
                    const dl = r.createReactionCollector(download);
                    const forwards = r.createReactionCollector(forwardsFilter);
                    const Fiveforwads = r.createReactionCollector(forwardsFiveFilter);

                    Fivebackwards.on('collect', (f) => {
                        if (pagination <= 5) return;
                        pagination -= 5;
                        embed.setImage(gambar[pagination - 1])
                        embed.setFooter(`Page ${pagination} of ${gambar.length}`)
                        r.edit(embed);
                    });

                    backwards.on('collect', (f) => {
                        if (pagination === 1) return;
                        pagination--;
                        embed.setImage(gambar[pagination - 1]);
                        embed.setFooter(`Page ${pagination} of ${gambar.length}`)
                        r.edit(embed);

                    })

                    forwards.on("collect", (f) => {
                        if (pagination == gambar.length) return;
                        pagination++;
                        embed.setImage(gambar[pagination - 1]);
                        embed.setFooter(`Page ${pagination} of ${gambar.length}`);
                        r.edit(embed);
                    });

                    chaps.on('collect', async (f) => {
                        r.delete()
                        await this.getChapList(data, message)
                    });

                    Fiveforwads.on('collect', (f) => {
                        if (pagination == gambar.length) return;
                        pagination += 5;
                        embed.setImage(gambar[pagination - 1]);
                        embed.setFooter(`Page ${pagination} of ${gambar.length}`)
                        r.edit(embed);
                    });

                    deletes.on('collect', (f) => {
                        r.delete()
                    });

                    dl.on('collect', async (f) => {
                        let embede = new Discord.MessageEmbed()
                            .setColor(this.client.warna.kato)
                            .setTitle('Download yang tersedia')
                            .addField('Download Format ZIP', `[klik di sini](https://mangadl-katow.herokuapp.com/download/komiku/${query}zip)`)
                            .addField('Download Format PDF', `[klik di sini](https://mangadl-katow.herokuapp.com/download/komiku/${query}pdf)`)
                        message.channel.send(embede).then(t => t.delete({ timeout: 10000 }))
                    })

                } catch (error) {
                    return message.channel.send(`Something went wrong: ${error.message}`);
                    // Restart the bot as usual. 
                }
                fullfill();
            } catch (err) {
                reject(err)
            }
        })
    };

}

module.exports = Komiku;