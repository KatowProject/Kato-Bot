const Discord = require("discord.js")
const fs = require("fs")

module.exports.run = async (client, message, args) => {

    if (client.config.channel.includes(message.channel.id)) return;
    let query = args.join('-')
    if (!query) return message.reply('Masukkan Permintaan terlebih dahulu!')
    const fetch = require('node-fetch')
    const get = await fetch(`https://lyrics-api.powercord.dev/lyrics?input=${query}`, { method: "GET" }).then(res => res.json())
        .catch((err) => { message.reply(err) })


    let data = {
        artis: get.data[0].artist,
        nama: get.data[0].name,
        lirik: get.data[0].lyrics,
        gambar: get.data[0].album_art
    }

    if (data.lirik.length > 2048) {
        let embed = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setAuthor(data.artis, data.gambar)
            .setTitle(data.nama)
            .setDescription(data.lirik.slice(0, 2048))
        await message.channel.send(embed);
        let embede = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setDescription(data.lirik.slice(2048, 4096))
        await message.channel.send(embede)

    } else {
        let embed = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setAuthor(data.artis, data.gambar)
            .setTitle(data.nama)
            .setDescription(data.lirik)
        await message.channel.send(embed)
    }



}


exports.conf = {
    aliases: ["lirik"],
    cooldown: 5
}

exports.help = {
    name: 'lyrics',
    description: 'lirik lagu',
    usage: 'lyrics <query>',
    example: 'repeat <qeury>'
}