const Discord = require('discord.js');

module.exports = client => {

    client.player
        .on('trackStart', (message, track) => message.channel.send({
            embed: {
                color: client.warna.success,
                description: `${client.emoji.success} **|** [${track.title}](${track.url}) **Now Playing!** \n\n Durasi: \`${track.duration}\`\n\n Permintaan : ${track.requestedBy}\n\n Author: \`${track.author}\``,
                thumbnail: { url: track.thumbnail.replace('hqdefault', 'maxresdefault') }
            }
        }))

        // Send a message when something is added to the queue
        .on('trackAdd', (message, queue, track) => message.channel.send({
            embed: {
                color: client.warna.success,
                description: `${client.emoji.success} **|** [${track.title}](${track.url}) **Added to the queue!** \n\n Durasi: \`${track.duration}\`\n\n Permintaan : ${track.requestedBy}\n\n Author: \`${track.author}\``,
                thumbnail: { url: track.thumbnail.replace('hqdefault', 'maxresdefault') }
            }
        }))

        .on('playlistAdd', (message, queue, playlist) => message.channel.send({
            embed: {
                color: client.warna.success,
                description: `**Menambahkan ${playlist.tracks.length} lagu ke dalam antrian!**\n
                                  ${client.emoji.music} | Current Playing:\n${playlist.tracks[0].title}`,
                thumbnail: { url: playlist.tracks[0].thumbnail }
            }
        }))

        // Send messages to format search results
        .on('searchResults', (message, query, tracks) => {

            const embed = new Discord.MessageEmbed()
                .setAuthor(`Hasil Pencarian ${query}!`)
                .setDescription(tracks.map((t, i) => `**${i + 1}. ${t.title}**`).join('\n'))
                .setFooter('Pilihlah dengan angka untuk melanjutkan!')
            message.channel.send(embed);

        })
        .on('searchInvalidResponse', (message, query, tracks, content, collector) => {

            const args = ['cancel', 'batal', 'gajadi', 'salah'];
            if (args.includes(content)) {

                collector.stop();
                return message.channel.send({
                    embed: {
                        color: client.warna.warning,
                        description: 'Pencarian dibatalkan!'
                    }
                });

            }

            message.channel.send({
                embed: {
                    color: client.warna.warning,
                    description: `Permintaan harus valid dimulai dari 1 sampai ${tracks.length}!`
                }
            });

        })

        .on('searchCancel', (message, query, tracks) => message.channel.send({
            embed: {
                color: client.warna.success,
                description: `Tidak ada responsif sama sekali, permintaan dibatalkan!`
            }
        }))

        .on('noResults', (message, query) => message.channel.send({
            embed: {
                color: client.warna.warning,
                description: `Tidak ditemukan ${query} oleh Kato!`
            }
        }))

        // Send a message when the music is stopped
        .on('queueEnd', (message, queue) => message.channel.send('Antrian telah selesai, bot akan keluar dari *Voice Channel*'))

        .on('channelEmpty', (message, queue) => message.channel.send('Tidak ada satupun partisipan di *Voice Channel*, bot akan keluar!'))

        .on('botDisconnect', (message) => message.channel.send('Musik telah dihentikan, bot akan keluar dari *Voice Channel*'))

        // Error handling
        .on('error', (error, message) => {
            switch (error) {
                case 'NotPlaying':
                    message.channel.send('Tidak ada music yang berputar di *Voice Channel*!')
                    break;
                case 'NotConnected':
                    message.channel.send('Kamu tidak terhubung di *Voice Channel*!')
                    break;
                case 'UnableToJoin':
                    message.channel.send('Berikan Kato akses untuk melanjutkan!')
                    break;
                case 'LiveVideo':
                    message.channel.send('Tidak mendukung video Siaran Langsung')
                    break;
                case 'VideoUnavailable':
                    message.channel.send('Video tidak tersedia!');
                    break;
                default:
                    message.channel.send(`Something went wrong... Error: ${error}`)
            }
        })

}