const Discord = require('discord.js');
const axios = require('axios');

class Kusonime {
    constructor(client) {
        this.client = client;
    }

    getBySearch(query, message) {
        return new Promise(async (fullfill, reject) => {
            try {

                const response = await axios.get(`https://kusonime-scrapper.glitch.me/api/cari/${query}`);
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

                const response = await axios.get(`http://kusonime-rest.herokuapp.com/api/anime/${query}`);
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

module.exports = Kusonime;