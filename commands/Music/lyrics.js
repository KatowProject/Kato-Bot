const Discord = require("discord.js");
const axios = require('axios');

module.exports.run = async (client, message, args) => {
    try {
        const query = args.join('%20');
        const req = await axios.get(`https://lyrics-api.powercord.dev/lyrics?input=${query}`).catch((err) => { message.reply(err) });
        const res = req.data;

        const data = {
            artis: res.data[0].artist,
            nama: res.data[0].name,
            lirik: res.data[0].lyrics,
            gambar: res.data[0].album_art,
            url: res.data[0].url
        };

        const chunk = client.util.chunkString(data.lirik, 2048);
        const first = chunk.shift();

        const embed = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setAuthor(data.artis, data.gambar, data.url)
            .setTitle(data.nama)
            .setDescription(first)
        message.channel.send(embed);

        chunk.forEach(a => {
            const embed = new Discord.MessageEmbed()
                .setColor(client.warna.kato)
                .setDescription(a)
            message.channel.send(embed);
        });
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