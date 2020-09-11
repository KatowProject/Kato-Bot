const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment')
exports.run = async (client, message, args) => {

    if (args[0] === 'karawang') {
        let get = await require('node-superfetch').get('https://covid-apiw.herokuapp.com/api')
        let json = get.body

        let embed = new Discord.MessageEmbed()
            .setAuthor('Kabupaten Karawang, Jawa Barat', 'https://covid19.karawangkab.go.id/assets/images/logo_karawangicon.png', 'http://covid19.karawangkab.go.id/')
            .setColor(client.warna.kato)
            .addField('Konfirmasi', `\`Sembuh: ${json.konfirmasi.sembuh}\nIsolasi Mandiri: ${json.konfirmasi.isolasi_mandiri}\nTotal: ${json.konfirmasi.total}\``)
            .addField('Kontak Erat', `\`Karantina Mandiri: ${json.kontak_erat.karantina_mandiri}\nDiscarded: ${json.kontak_erat.discarded}\nTotal: ${json.kontak_erat.total}\``, true)
            .addField('Probabel', `\`Dalam Perawatan: ${json.probabel.dalam_perawatan}\nSelesai Isolasi: ${json.probabel.selesai_isolasi}\nMeninggal: ${json.probabel.meninggal}\nTotal: ${json.probabel.total}\``, true)
            .addField('Suspek', `\`Dalam Perawatan: ${json.suspek.dalam_perawatan}\nIsolasi Mandiri: ${json.suspek.isolasi_mandiri}\nDiscarded: ${json.suspek.discarded}\nTotal: ${json.suspek.total}\``, true)

            .setFooter(`API oleh KatowProject pada Tanggal ${moment().format('DD-MM-YYYY')}`)
        message.channel.send(embed)

    } else {

        let embed = new Discord.MessageEmbed().setColor(client.warna.kato).setFooter(`API oleh KawalCorona pada Tanggal ${moment().format('DD-MM-YYYY')} `)

        let get = await require("node-superfetch").get(`https://api.kawalcorona.com/indonesia/provinsi/`);
        let provinsi = get.body.map(x => x.attributes["Provinsi"])
        let msgp = await message.reply(provinsi.join(', '))
        let amsg = await message.channel.send('Di antara provinsi tersebut, yang mana ingin anda ketahui secara detail informasinya? (Symbol Sensitive)')
        let response = await message.channel.awaitMessages(
            m => m.author.id === message.author.id,
            { max: 1, time: 300000, errors: ['time'] }
        ).then(async collected => {
            await msgp.delete()
            await amsg.delete()
            index = collected.first().content
            getResult(index)
        }).catch((err) => { message.reply('Waktu permintaan telah habis!\nSilahkan buat permintaan kembali!') })


        function getResult(location) {

            const region = location;

            (async () => {
                const data = await fetch("https://api.kawalcorona.com/indonesia/provinsi/", { method: "GET" }).then(res => res.json())

                const findRegion = data.find(d => {
                    return d.attributes.Provinsi.toLowerCase() === region.toLowerCase() // to lower case avoid case sensitive
                })
                const finalResult = findRegion ? findRegion.attributes : { error: true, message: embed.setDescription(`Region ${region} tidak ditemukan!`) }; // flatten attributes

                let persentase = {
                    sembuh: `${finalResult.Kasus_Semb}` / `${finalResult.Kasus_Posi}` * '100',
                    meninggal: `${finalResult.Kasus_Meni}` / `${finalResult.Kasus_Posi}` * '100'
                }
                embed.setTitle(`[ID] ${region}, Indonesia`)
                embed.addField(`Kasus Dikonfirmasi:`, `${finalResult.Kasus_Posi.toLocaleString()} Orang`, true);
                embed.addField(`Sembuh:`, `${finalResult.Kasus_Semb.toLocaleString()} Orang (${persentase.sembuh.toFixed(2)}%)`, true);
                embed.addField(`Meninggal:`, `${finalResult.Kasus_Meni.toLocaleString()} Orang (${persentase.meninggal.toFixed(2)}%)`, true);

                message.reply(!finalResult.error ? embed : finalResult.message);

            })()
        }


        /*.then(async collected => {
    
            await msgp.delete()
            await amsg.delete()
    
            const jawab = collected.first().content
            const data = getResult(jawab)
            message.channel.send(data)
    
    
        })*/

    }
}

exports.conf = {
    aliases: ["covid"],
    cooldown: 7
}

exports.help = {
    name: 'cov-id',
    description: 'covid-19 versi indonesia',
    usage: 'cov-id',
    example: 'cov-id'
}