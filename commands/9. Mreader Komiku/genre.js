const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    let get = await require('node-superfetch').get(`http://206.189.91.238/komiku/genres`)
    try {
        //mendapatkan data title untuk informasi pada embed
        let array_title = [];
        let json_title = get.body.list_genre
        json_title.forEach((a, i) => {
            array_title.push(`**${i + 1}**. **${a.title}**`)
        });
        // untuk jaga-jaga semisalnya data yang masuk lebih dari 10, maka difilter terlebih dahulu
        var pagination = 1
        let title_chunk = client.util.chunk(array_title, 10);

        //setelah mendapatkan data di atas, dapatkan juga endpoint pada judulnya
        let array_endpoint = [];
        let json_endpoint = get.body.list_genre
        json_endpoint.forEach((a, i) => {
            array_endpoint.push(a.endpoint)
        });

        //kita mulai mengirim pesan embed untuk memberikan informasi pada pada peminta
        let embed = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setTitle('Genre List')
            .setDescription(title_chunk[pagination - 1])
            .setFooter(`Page 1 of ${title_chunk.length}`)
        let g = await message.channel.send(embed)
        await g.react('👈')
        await g.react('👉')

        const backwardsFilter = (reaction, user) =>
            reaction.emoji.name === `👈` && user.id === message.author.id;
        const forwardsFilter = (reaction, user) =>
            reaction.emoji.name === `👉` && user.id === message.author.id;



        const backwards = g.createReactionCollector(backwardsFilter);
        const forwards = g.createReactionCollector(forwardsFilter);



        backwards.on('collect', (f) => {
            if (pagination === 1) return;
            pagination--;
            embed.setDescription(title_chunk[pagination - 1]);
            embed.setFooter(`Page ${pagination} of ${title_chunk.length}`)
            g.edit(embed);

        })

        forwards.on("collect", (f) => {
            if (pagination == title_chunk.length) return;
            pagination++;
            embed.setDescription(title_chunk[pagination - 1]);
            embed.setFooter(`Page ${pagination} of ${title_chunk.length}`);
            g.edit(embed);
        });


        //di sini bot akan meminta kepada user untuk melanjutkan ke tahap selanjutnya
        let reply = await message.reply('Pilih genre untuk melanjutkan!')
        let response = await message.channel.awaitMessages((m) => m.content > 0 && m.content <= 1000, {
            max: 1,
            time: 500000,
            errors: ["time"]
        }).catch((err) => {
            return message.reply('waktu permintaan telah habis!\nSilahkan buat Permintaan kembali!')
                .then(t => {
                    g.delete()
                })
        });

        //di sini didapatkan data yang telah diberikan oleh user
        let index = parseInt(response.first().content);
        let p = array_endpoint[index - 1]
        await reply.delete()
        await g.delete()
        //console.log(p)

        //sekarang lanjut ambil data
        await client.komiku.getGenre(p, message)



    } catch (error) {
        return console.log(error);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 10
}

exports.help = {
    name: 'kgenre',
    description: 'genre list',
    usage: 'genre',
    example: 'genre'
}