const Discord = require("discord.js")
const fs = require("fs");

module.exports.run = async (client, message, args) => {
    if (client.config.discord.channels.includes(message.channel.id)) return;
    if (!message.member.voice.channel) return message.channel.send({
        embed: {
            color: client.warna.error,
            description: `${client.emoji.error} | Kamu harus masuk Channel Voice terlebih dahulu!`
        }
    })

    let search = await client.player.searchTracks(args.join(' '), true)
    if (search.length > 1) search = search.slice(0, 15)
    // Sends an embed with the 10 first songs
    const embed = new Discord.MessageEmbed().setColor(client.warna.success)
        .setDescription(search.map((t, i) => `**${i + 1} -** [${t.name}](${t.url})`).join("\n"))
        .setFooter("Send the number of the track you want to play!");
    let q = await message.channel.send(embed);
    // Wait for user answer
    let response = await message.channel.awaitMessages((m) => m.content > 0 && m.content <= 15, {
        max: 1,
        time: 20000,
        errors: ["time"]
    }).catch((err) => {
        q.delete()
        message.reply('Waktu permintaan telah habis, silahkan buat permintaan kembali!').then(t => t.delete({ timeout: 5000 }))
    })

    const index = parseInt(response.first().content);
    let track = search[index - 1];
    await q.delete();
    // Then play the song
    let requestedBy = client.users.cache.get(message.author.id).tag
    let playing = client.player.isPlaying(message.guild.id)

    if (playing) {
        // Add the song to the queue 
        let song = await client.player.addToQueue(message.guild.id, track, requestedBy);


        message.channel.send({
            embed: {
                color: client.warna.success,
                description: `${client.emoji.success} **|** [${song.name}](${song.url}) **Added to the queue!** \n\n Durasi: \`${song.duration}\`\n\n Permintaan : \`${song.requestedBy}\`\n\n Author: \`${song.author}\``,
                thumbnail: { url: song.thumbnail.replace('hqdefault', 'maxresdefault') }
            }
        });

    } else {
        // Else, play the song
        const song = await client.player.play(message.member.voice.channel, track, requestedBy);

        message.channel.send({
            embed: {
                color: client.warna.success,
                description: `${client.emoji.music} | Now Playing : \n [${song.name}](${song.url})\n \n\`Durasi : ${song.duration}\`\n \n\`Permintaan : ${song.requestedBy}\``,
                thumbnail: { url: song.thumbnail.replace('hqdefault', 'maxresdefault') }
            }
        })


        client.player.getQueue(message.guild.id)
            .on('end', () => {
                message.channel.send({
                    embed: {
                        color: client.warna.warning,
                        description: `${client.emoji.warning} | Antrian telah selesai, tambahkan lagu lagi untuk memutar!`
                    }
                })

            })

            .on('trackChanged', (oldTrack, newTrack, skipped, repeatMode) => {

                if (repeatMode) {

                    message.channel.send({
                        embed: {
                            color: client.warna.success,
                            description: `${client.emoji.music} |  Now Repeating : \n [${oldTrack.name}](${oldTrack.url})\n \nDurasi : ${oldTrack.duration}\n \nPermintaan : ${oldTrack.requestedBy}`,
                            thumbnail: {
                                url: oldTrack.thumbnail.replace('hqdefault', 'maxresdefault')
                            }
                        }
                    });

                } else {
                    message.channel.send({
                        embed: {
                            color: client.warna.success,
                            description: `${client.emoji.music} | Now Playing : \n [${newTrack.name}](${newTrack.url})\n \nDurasi : ${newTrack.duration}\n \nPermintaan : ${newTrack.requestedBy}`,
                            thumbnail: newTrack.thumbnail.replace('hqdefault', 'maxresdefault')
                        }
                    })
                }
            });
    }


}

exports.conf = {
    aliases: ['search'],
    cooldown: 5
}

exports.help = {
    name: 'search',
    description: 'mencari lalu, memulai musik',
    usage: 'search <query>',
    example: 'search kato cantik'
}
