const Discord = require('discord.js');
const moment = require('moment');
const axios = require('axios');

exports.run = async (client, message, args) => {

    if (args[0] === 'karawang') {
        const get = await axios.get('https://covid-apiw.herokuapp.com/api');
        const json = get.data;

        let embed = new Discord.MessageEmbed()
            .setAuthor('Kabupaten Karawang, Jawa Barat', 'https://covid19.karawangkab.go.id/assets/images/logo_karawangicon.png', 'http://covid19.karawangkab.go.id/')
            .setColor(client.warna.kato)
            .addField('Konfirmasi', `\`Sembuh: ${json.konfirmasi.sembuh}\nIsolasi Mandiri: ${json.konfirmasi.isolasi_mandiri}\nTotal: ${json.konfirmasi.total}\``)
            .addField('Kontak Erat', `\`Karantina Mandiri: ${json.kontak_erat.karantina_mandiri}\nDiscarded: ${json.kontak_erat.discarded}\nTotal: ${json.kontak_erat.total}\``, true)
            .addField('Probabel', `\`Dalam Perawatan: ${json.probabel.dalam_perawatan}\nSelesai Isolasi: ${json.probabel.selesai_isolasi}\nMeninggal: ${json.probabel.meninggal}\nTotal: ${json.probabel.total}\``, true)
            .addField('Suspek', `\`Dalam Perawatan: ${json.suspek.dalam_perawatan}\nIsolasi Mandiri: ${json.suspek.isolasi_mandiri}\nDiscarded: ${json.suspek.discarded}\nTotal: ${json.suspek.total}\``, true)

            .setFooter(`API oleh KatowProject pada Tanggal ${moment().format('DD-MM-YYYY')}`)
        message.channel.send({ embeds: [embed] });
    } else {
        const embed = new Discord.MessageEmbed().setColor(client.warna.kato).setFooter(`API oleh KawalCorona pada Tanggal ${moment().format('DD-MM-YYYY')} `)

        const get = await axios.get(`https://api.kawalcorona.com/indonesia/provinsi/`);
        const provinsi = get.data.map(x => x.attributes["Provinsi"]);
        const msgp = await message.reply(provinsi.join(', '));
        const amsg = await message.channel.send('Di antara provinsi tersebut, yang mana ingin anda ketahui secara detail informasinya? (Symbol Sensitive)')
        const response = await message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: 300000, errors: ['time'] }
        ).catch((err) => { message.reply('Waktu permintaan telah habis!\nSilahkan buat permintaan kembali!') });

        await msgp.delete();
        await amsg.delete();

        const reqRegion = response.first().content;

        const findRegion = get.data.find(reg => reg.attributes.Provinsi.toLowerCase() === reqRegion.toLowerCase());
        if (!findRegion) return message.channel.send({
            embeds: [
                {
                    embed: {
                        description: '**Data tidak ditemukan!**',
                        color: client.warna.error
                    }
                }
            ]
        });
        const finalResult = findRegion.attributes;
        const persentase = {
            sembuh: `${finalResult.Kasus_Semb}` / `${finalResult.Kasus_Posi}` * '100',
            meninggal: `${finalResult.Kasus_Meni}` / `${finalResult.Kasus_Posi}` * '100'
        };

        embed.setTitle(`[ID] ${finalResult.Provinsi}, Indonesia`)
        embed.addField(`Kasus Dikonfirmasi:`, `${finalResult.Kasus_Posi.toLocaleString()} Orang`, true);
        embed.addField(`Sembuh:`, `${finalResult.Kasus_Semb.toLocaleString()} Orang (${persentase.sembuh.toFixed(2)}%)`, true);
        embed.addField(`Meninggal:`, `${finalResult.Kasus_Meni.toLocaleString()} Orang (${persentase.meninggal.toFixed(2)}%)`, true);

        message.channel.send({ embeds: [embed] });
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