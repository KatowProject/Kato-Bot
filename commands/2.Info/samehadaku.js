const Discord = require('discord.js');

exports.run = async (client, message, args) => {


    let anime = args.join('-')
    if (anime.length < 1) return message.reply('Berikan judulnya!')
    let get = await require("node-superfetch").get(`https://samehadaku-rest-api.herokuapp.com/anime/eps/${anime}`)

    let info = {
        judul: get.body.title,
        anime: get.body.detail_anime.title,
        upload: get.body.date_uploaded,
        genre: get.body.detail_anime.genres.join(', '),
        image: get.body.detail_anime.image,
        sinopsis: get.body.detail_anime.sinopsis
    }

    let kualitas = {
        rendah_MKV: get.body.downloadEps[0].data[0].quality || 'tidak tersedia',
        normal_MKV: get.body.downloadEps[0].data[1].quality || 'tidak tersedia',
        tinggi_MKV: get.body.downloadEps[0].data[2].quality || 'tidak tersedia',
        //////////////////////////////////////////
        rendah_MP4: get.body.downloadEps[1].data[0].quality || 'tidak tersedia',
        normal_MP4: get.body.downloadEps[1].data[1].quality || 'tidak tersedia',
        tinggi_MP4: get.body.downloadEps[1].data[2].quality || 'tidak tersedia',
    }

    let drive = {
        zrendah_MKV: get.body.downloadEps[0].data[0].link.zippyshare || 'tidak tersedia',
        znormal_MKV: get.body.downloadEps[0].data[1].link.zippyshare || 'tidak tersedia',
        ztinggi_MKV: get.body.downloadEps[0].data[2].link.zippyshare || 'tidak tersedia',
        ////////////////////////////////////////////////////
        zrendah_MP4: get.body.downloadEps[1].data[0].link.zippyshare || 'tidak tersedia',
        znormal_MP4: get.body.downloadEps[1].data[1].link.zippyshare || 'tidak tersedia',
        ztinggi_MP4: get.body.downloadEps[1].data[2].link.zippyshare || 'tidak tersedia',

        gdr_MKV: get.body.downloadEps[0].data[0].link.gdrive || 'tidak tersedia',
        gdn_MKV: get.body.downloadEps[0].data[1].link.gdrive || 'tidak tersedia',
        gdt_MKV: get.body.downloadEps[0].data[2].link.gdrive || 'tidak tersedia',

        gdr_MP4: get.body.downloadEps[1].data[0].link.gdrive || 'tidak tersedia',
        gdn_MP4: get.body.downloadEps[1].data[1].link.gdrive || 'tidak tersedia',
        gdt_MP4: get.body.downloadEps[1].data[2].link.gdrive || 'tidak tersedia',

    }

    //pakek ini biar gk pusing sama kode sendiri
    let short = {
        zippyshare_MKV: `**${kualitas.rendah_MKV}**: [Klik Di sini](${drive.zrendah_MKV})\n**${kualitas.normal_MKV}**: [Klik Di sini](${drive.znormal_MKV})\n**${kualitas.tinggi_MKV}**: [Klik Di sini](${drive.ztinggi_MKV})`,
        zippyshare_MP4: `**${kualitas.rendah_MP4}**: [Klik Di sini](${drive.zrendah_MP4})\n**${kualitas.normal_MP4}**: [Klik Di sini](${drive.znormal_MP4})\n**${kualitas.tinggi_MP4}**: [Klik Di sini](${drive.ztinggi_MP4})`,
        gdrive_MKV: `**${kualitas.rendah_MKV}**: [Klik Di sini](${drive.gdr_MKV})\n**${kualitas.normal_MKV}**: [Klik Di sini](${drive.gdn_MKV})\n**${kualitas.tinggi_MKV}**: [Klik Di sini](${drive.gdt_MKV})`,
        gdrive_MP4: `**${kualitas.rendah_MP4}**: [Klik Di sini](${drive.gdr_MP4})\n**${kualitas.normal_MP4}**: [Klik Di sini](${drive.gdn_MP4})\n**${kualitas.tinggi_MP4}**: [Klik Di sini](${drive.gdt_MP4})`
    }

    try {

        let embed = new Discord.MessageEmbed()
            .setTitle(info.anime)
            .setAuthor(info.judul)
            .setColor(client.warna.kato)
            .setImage(info.image.replace('quality=90&resize=155,213', ' '))
            .addField('Genre', info.genre)
            .setFooter(`Diupload: ${info.upload}`)
        await message.channel.send(embed)

        let Dembed = new Discord.MessageEmbed()
            .setTitle('Link Download')
            .addField('ZippyShare (Format MKV)', short.zippyshare_MKV)
            .addField('ZippyShare (Format MP4)', short.zippyshare_MP4)
            .setColor(client.warna.kato)
        await message.channel.send(Dembed)

        let Gembed = new Discord.MessageEmbed()
            .setDescription(`**Google Drive (Format MKV)**\n ${short.gdrive_MKV}`)
            .setColor(client.warna.kato)
        await message.channel.send(Gembed)

        let Geembed = new Discord.MessageEmbed()
            .setDescription(`**Google Drive (Format MP4)**\n ${short.gdrive_MP4}`)
            .setColor(client.warna.kato)
        await message.channel.send(Geembed)

    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual. 
    }
}

exports.conf = {
    aliases: ["same"],
    cooldown: 5
}

exports.help = {
    name: 'samehadaku',
    description: 'Menampilkan pengetesan jaringan bot Kato.',
    usage: 'ping',
    example: 'ping'
}