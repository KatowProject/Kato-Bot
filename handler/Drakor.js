const Discord = require('discord.js');
const axios = require('axios');
const { MessageButton } = require('discord-buttons');
class Drakor {
    constructor(client) {
        this.client = client;
    }

    getBySearch(query, message) {
        return new Promise(async (fullfill, reject) => {
            try {

                const response = await axios.get('http://posantai.bugs.today/drakor/api/cari/' + query);
                const data = response.data;

                if (data.length < 1) return message.reply('Pencarian tidak ditemukan');
                if (data.length === 1) return this.client.drakor.getDrakor(data[0].link.endpoint, message);

                const resBed = new Discord.MessageEmbed()
                    .setColor(this.client.warna.kato)
                    .setTitle('Hasil Pencarian: ')
                    .setDescription(data.map((a, i) => `**${i + 1}. ${a.title}**`).join('\n'))
                const resenbed = await message.channel.send(resBed);
                const replybed = await message.reply('pilih pakai angka!');

                const awaitingMsg = await message.channel.awaitMessages((msg) => msg.content.toLowerCase() && msg.author.id === message.author.id, {
                    max: 1,
                    time: 15000,
                    errors: ["time"]
                }).catch(err => message.reply('Waktu telah habis, silahkan buat permintaan kembali!').then((m) => m.delete({ timeout: 5000 })));

                await resenbed.delete();
                await replybed.delete();

                const answerMsg = awaitingMsg.first().content;
                this.client.drakor.getDrakor(data[answerMsg - 1].link.endpoint, message);

                fullfill();
            } catch (err) {
                console.log(err);
                reject(`Sepertinya terjadi kesalahan\nMessage: ${err.message}`);
            }
        });
    }

    getDrakor(query, message) {
        return new Promise(async (fullfill, reject) => {
            try {
                query = query.replace('https://ratudrakor.com/', '');
                const response = await axios.get('http://posantai.bugs.today/drakor/api/drakor/' + query);
                const data = response.data;

                const msginfo = await message.channel.send(
                    new Discord.MessageEmbed()
                        .setColor(this.client.warna.kato)
                        .setTitle(data.title)
                        .setImage(data.thumbnail)
                        .addField('Alter Title: ', data.alter_title, true)
                        .addField('Total Episode: ', data.total_eps, true)
                        .addField('Genre: ', data.genre.join(', '), true)
                        .addField('Durasi: ', data.duration, true)
                        .addField('Score: ', data.score, true)
                        .addField('Channel', data.channel, true)
                )

                let page = 1;
                const chapter = data.list_download.map((a, i) => `**${i + 1}. ${a.title}**`);
                const chunkChapter = this.client.util.chunk(chapter, 15);
                const embed = new Discord.MessageEmbed()
                    .setColor(this.client.warna.kato)
                    .setTitle('Episode List: ')
                    .setDescription(chunkChapter[page - 1].join('\n'))
                    .setFooter(`Page ${page} of ${chunkChapter.length}`)

                const backwardsButton = new MessageButton().setStyle('grey').setLabel('< Back').setID('backID');
                const forwardsButton = new MessageButton().setStyle('grey').setLabel('Next >').setID('nextID');
                const buttonList = [backwardsButton, forwardsButton];
                let r = await message.channel.send({ embed, buttons: this.client.util.buttonPageFilter(buttonList, chunkChapter.length, page) });

                const collector = r.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 500000 });
                collector.on('collect', (button) => {
                    button.reply.defer();
                    switch (button.id) {
                        case 'backID':
                            if (page === 1) return;
                            page--;

                            embed.setDescription(chunkChapter[page - 1].join('\n'));
                            embed.setFooter(`Page ${page} of ${chunkChapter.length}`);

                            r.edit({ embed, buttons: this.client.util.buttonPageFilter(buttonList, chunkChapter.length, page) });
                            break;

                        case 'nextID':
                            if (page === chunkChapter.length) return;
                            page++;

                            embed.setDescription(chunkChapter[page - 1].join('\n'));
                            embed.setFooter(`Page ${page} of ${chunkChapter.length}`);

                            r.edit({ embed, buttons: this.client.util.buttonPageFilter(buttonList, chunkChapter.length, page) });
                            break;
                    }
                });

                const alertChapter = await message.reply('Pilih menggunakan angka!');
                const awaitingChap = await message.channel.awaitMessages((msg) => msg.content.toLowerCase() && msg.author.id === message.author.id, {
                    max: 1,
                    times: 15000,
                    errors: ['time']
                }).catch(err => message.reply('Waktu telah habis, silahkan buat permintaan kembali!').then(m => m.delete({ timeout: 5000 })));

                await msginfo.delete();
                await r.delete();
                await alertChapter.delete();

                const answerChap = awaitingChap.first().content;
                const dlChap = data.list_download[answerChap - 1];

                const dlBed = new Discord.MessageEmbed().setColor(this.client.warna.kato).setTitle(dlChap.title);

                const p = dlChap.list_download;
                const tempDL = [];
                for (let i = 0; i < p.length; i++) {
                    if (typeof p[i] === 'object') continue;
                    tempDL.push(`**${p[i]}**\n${p[i + 1].map(a => `[${a[0]}](${a[1]})`).join('\n')}`)
                }
                dlBed.setDescription(tempDL.join('\n'))

                await message.channel.send(dlBed);
                fullfill();

            } catch (err) {
                console.log(err);
                reject(`Sepertinya terjadi kesalahan\nMessage: ${err.message}`)
            }
        });
    }
}

module.exports = Drakor;