const Discord = require('discord.js');
const fetch = require('isomorphic-unfetch');
const spotify = require('spotify-url-info')(fetch);
const ytdl = require('ytdl-core');
const ys = require('youtube-sr').default;

exports.run = async (client, message, args) => {
    try {
        /** Get Data Member */
        const get = client.users.cache.get(args[0]) || message.author || message.mentions.members.first();
        const member = message.guild.members.cache.get(get.id).presence.activities;
        const getData = member.find(a => a.name.toLowerCase() === 'spotify');
        if (!getData) return message.reply('Spotify tidak terdektsi di presence!');

        /** Get Data Song */
        const song = await spotify.getData(`https://open.spotify.com/track/${getData.syncId}`);

        const dominantColor = song.coverArt.extractedColors.colorDark.hex;
        const artists = song.artists.map((a) => {
            const uri = a.uri.split(':');
            return `[${a.name}](https://open.spotify.com/${uri[1]}/${uri[2]})`;
        });
        const embed = new Discord.MessageEmbed()
            .setColor(dominantColor)
            .setAuthor({
                name: 'Spotify Current Playing',
                iconURL: 'https://cdn.discordapp.com/attachments/932997960923480099/933878227536080956/spotify.png',
                url: `https://open.spotify.com/track/${getData.syncId}`
            })
            .setImage(song.coverArt.sources.shift().url)
            .setFields([
                { name: 'Title: ', value: song.name, inline: true },
                { name: 'Artist: ', value: artists.join(', '), inline: true },
                { name: 'Length: ', value: client.util.timeParser(song.duration / 1000), inline: true },
                { name: 'Link: ', value: `[Click Here](https://open.spotify.com/track/${getData.syncId})`, inline: true }
            ])
            .setFooter({ text: get.tag, iconURL: get.displayAvatarURL({ dynamic: true }) })

        const buttons = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton().setLabel('Get Preview Song ▶️').setStyle('SECONDARY').setCustomId(`spotify-preview-${get.id}`),
                new Discord.MessageButton().setLabel('Download Song 📥').setStyle('SECONDARY').setCustomId(`spotify-download-${get.id}`)
            ]);

        const msg = await message.reply({ embeds: [embed], components: [buttons] });
        const filter = (i) => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });
        collector.on('collect', async (i) => {
            if (i.customId === `spotify-preview-${get.id}`) {
                await i.deferUpdate();

                const attachment = new Discord.MessageAttachment()
                    .setFile(song.audioPreview.url)
                    .setName(`${song.name}.mp3`);
                console.log(attachment);
                await i.followUp({ content: 'Here is your preview song!', files: [attachment] });
            } else if (i.customId === `spotify-download-${get.id}`) {
                await i.deferUpdate();
                // give alert
                const alert = await i.followUp({ content: 'Tunggu sebentar, sedang mencari link download...' });
                const search = await ys.searchOne(`${song.name}}`);
                const info = await ytdl.getInfo(search.id);
                const audio = ytdl.filterFormats(info.formats, 'audioonly').sort((a, b) => b.audioBitrate - a.audioBitrate).shift();
                const attachment = new Discord.MessageAttachment()
                    .setFile(audio.url)
                    .setName(`${song.name}.mp3`);
                console.log(attachment);
                await alert.edit({ content: 'Ini link downloadnya!', files: [attachment] })
            }
        });

    } catch (error) {
        message.channel.send(`Something went wrong: ${error.message}`);
        console.log(error);
        // Restart the bot as usual. 
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'spotify',
    description: 'Menampilkan status spotify',
    usage: 'spotify',
    example: 'spotify'
}