const Discord = require("discord.js")
const axios = require('axios')

module.exports.run = async (client, message, args) => {

    try {

        let query = args.join('%20');
        const now = client.player.nowPlaying(message);
        if (!query) query = now.title.split(' ').join('%20');
        let get = await axios.get(`https://lyrics-api.powercord.dev/lyrics?input=${query}`)
            .catch((err) => { message.reply(err) })
        get = get.data

        let data = {
            artis: get.data[0].artist,
            nama: get.data[0].name,
            lirik: get.data[0].lyrics,
            gambar: get.data[0].album_art,
            url: get.data[0].url
        }

        let chunk = client.util.chunkString(data.lirik, 2048)
        let first = chunk.shift()


        let embed = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setAuthor(data.artis, data.gambar, data.url)
            .setTitle(data.nama)
            .setDescription(first)
        await message.channel.send(embed)

        chunk.forEach(a => {
            let embed = new Discord.MessageEmbed()
                .setColor(client.warna.kato)
                .setDescription(a)
            message.channel.send(embed)

        })

        /*if (data.lirik.length > 2048) {
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
        */
    } catch (err) {
        console.log(err);
        return message.channel.send(err.message);
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