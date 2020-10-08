const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {
    let query = args.join(' ')
    if (query.length < 5) return message.reply('harap memasukkan permintaan minimal \`5 karakter\`!')

    //kita mulai di sini
    getSearch(query, message);


    async function getSearch(query, message) {
        try {
            //ngambil data
            let get = await axios.get(`https://samehadaku-rest-api.herokuapp.com/search/${query}/1`)

            //data pencarian
            let json_title = get.data.results
            if (json_title.length == 0) return message.reply(`Pencarian dengan nama \`${query}\` tidak ditemukan!`)
            //buat title_array
            let title_array = [];
            json_title.forEach((a, i) => {
                title_array.push(`**${i + 1}.** **${a.title}**`)
            })
            //console.log(title_array)

            //data endpoint
            let json_endpoint = get.data.results
            //buat endpoint_array
            let endpoint_array = [];
            json_endpoint.forEach((a) => {
                endpoint_array.push(a.linkId)
            })
            //console.log(endpoint_array)

            //kirim data hasil pencarian ke user
            let embed = new Discord.MessageEmbed()
                .setColor(client.warna.kato)
                .setTitle('Hasil Pencarian')
                .setDescription(title_array.join('\n '))
            let eSend = await message.channel.send(embed)
            let re = await message.reply('pilih untuk melanjutkan!')

            // bot meminta jawaban dari user untuk melanjutkan ke tahap selanjutnya
            let response = await message.channel.awaitMessages((m) => m.content > 0 && m.content <= 1000, {
                max: 1,
                time: 100000,
                errors: ["time"]
            }).catch((err) => {
                return message.reply('waktu permintaan telah habis!\nSilahkan buat Permintaan kembali!')
                    .then(t => {
                        re.delete()
                        eSend.delete()
                        t.delete({ timeout: 5000 })
                    })
            })
            const index = parseInt(response.first().content)
            let next_q = endpoint_array[index - 1]
            await eSend.delete();
            await re.delete();
            //console.log(next_q)

            //lanjut ke tahap selanjutnya
            getDetail(next_q, message)
        } catch (error) {
            return message.channel.send(`Something went wrong: ${error.message}`);
            // Restart the bot as usual.
        }
    }

    async function getDetail(query, message) {
        //ambil data
        let get = await axios.get(`https://samehadaku-rest-api.herokuapp.com/anime/${query}`)

        //push string genre
        let array_genre = [];
        let json_genre = get.data.genre
        json_genre.forEach(a => {
            array_genre.push(`[${a.text}](${a.link})`)
        })

        //push string list episode
        let array_eps = [];
        let json_eps = get.data.list_episode
        json_eps.forEach((a, i) => {
            array_eps.push(`**${i + 1}**. **${a.title}**`)
        })
        //buat ambil kemungkinan lain, difilter dulu data yang masuk
        let page = 1
        let eps_chunk = client.util.chunk(array_eps, 12)

        //push string endpoint
        let array_endpoint = [];
        let json_endpoint = get.data.list_episode
        json_endpoint.forEach(a => {
            array_endpoint.push(a.id)
        })

        //kirim data anime ke user
        let embed = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setTitle(get.data.title)
            .setDescription(get.data.sinopsis.slice(0, 2048))
            .setImage(get.data.image)
            .addField('Genre', array_genre.join(', '), true)
            .addField('Judul dalam Bahasa Jepang', get.data.detail.Japanese, true)
            .addField('Status', get.data.detail.Status, true)
            .addField('Studio', get.data.detail.Studio, true)
            .addField('Season', get.data.detail.Season, true)
            .addField('Sinonim', get.data.detail.Synonyms ? get.data.detail.Synonyms : 'tidak tersedia', true)
        let dEmbed = await message.channel.send(embed);

        let embed2 = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setTitle('List Episode')
            .setDescription(eps_chunk[page - 1])
            .setFooter(`Page ${page} of ${eps_chunk.length}`)
        let eEmbed = await message.channel.send(embed2);
        let re = await message.reply('Pilih yang Chapter yang ingin didownload!')

        //bot meminta data ke user untuk melanjutkan
        let response = await message.channel.awaitMessages((m) => m.content > 0 && m.content <= 1000, {
            max: 1,
            time: 100000,
            errors: ["time"]
        }).catch((err) => {
            return message.reply('waktu permintaan telah habis!\nSilahkan buat Permintaan kembali!')
                .then(t => {
                    dEmbed.delete()
                    eEmbed.delete()
                    re.delete()
                    t.delete({ timeout: 5000 })
                })
        })
        const index = parseInt(response.first().content);
        let dld = array_endpoint[index - 1];
        await dEmbed.delete();
        await eEmbed.delete();
        await re.delete();
        //console.log(dld)

        //lanjut ke link download!
        getEpsList(dld, message);
    }

    async function getEpsList(query, message) {
        //ambil data
        let get = await require("node-superfetch").get(`https://samehadaku-rest-api.herokuapp.com/anime/eps/${query}`);
        get = get.body

        //data mkv
        let array_mkv = [];
        mkv(array_mkv);
        let embed = new Discord.MessageEmbed().setColor(client.warna.kato).setTitle('Format MKV').setAuthor(get.title);
        for (data of array_mkv) {
            embed.addField(data.kualitas, `[Klik di sini](${data.link})`, true)
        };

        await message.channel.send(embed);

        //data mp4
        let array_mp4 = [];
        mp4(array_mp4);
        let embede = new Discord.MessageEmbed().setColor(client.warna.kato).setTitle('Format MP4');
        for (data of array_mp4) {
            embede.addField(data.kualitas, `[Klik di sini](${data.link})`, true)
        };

        await message.channel.send(embede);

        //data x265
        let array_x265 = [];
        x265(array_x265);
        let embeded = new Discord.MessageEmbed().setColor(client.warna.kato).setTitle('Format x265');
        for (data of array_x265) {
            embeded.addField(data.kualitas, `[Klik di sini](${data.link})`, true)
        }
        await message.channel.send(embeded);

        return message.channel.send('jika formatnya tidak lengkap, maka hanya itu saja yang tersedia resolusinya').then(t => t.delete({ timeout: 5000 }))

        // ini tempat looping yaaahh
        function mkv(array) { //mkv
            //looping data
            for (let i = 0; i < get.downloadEps[0].data.length; i++) {
                const e_quality = get.downloadEps[0].data[i].quality;//quality
                const zippyshare = get.downloadEps[0].data[i].link.zippyshare;
                const gdrive = get.downloadEps[0].data[i].link.gdrive; //link
                const reupload = get.downloadEps[0].data[i].link.reupload;
                array.push({
                    kualitas: e_quality,
                    link: [zippyshare, gdrive, reupload]
                })
            }
        }

        //mp4
        function mp4(array) {
            //looping data
            for (let i = 0; i < get.downloadEps[1].data.length; i++) {
                const e_quality = get.downloadEps[1].data[i].quality; //quality
                const e_link = get.downloadEps[1].data[i].link.zippyshare; //link
                array.push({
                    kualitas: e_quality,
                    link: e_link
                })
            }
        }
        //x265
        function x265(array) {
            //looping
            for (let i = 0; i < get.downloadEps[2].data.length; i++) {
                const e_quality = get.downloadEps[2].data[i].quality;
                const e_link = get.downloadEps[2].data[i].link.zippyshare
                array.push({
                    kualitas: e_quality,
                    link: e_link
                })
            }
        }
    }

}



exports.conf = {
    aliases: ["same"],
    cooldown: 60
}

exports.help = {
    name: 'samehadaku',
    description: 'download anime ',
    usage: 'same <query>',
    example: 'same kanojo'
}
