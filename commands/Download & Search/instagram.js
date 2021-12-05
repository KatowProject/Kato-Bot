const Discord = require('discord.js');
const instaClient = require('scraper-instagram');
const insta = new instaClient();
const moment = require('moment');
moment.locale('id');

exports.run = async (client, message, args) => {
    try {
        let query = args.join(' ');
        if (!query) return message.reply('Masukkan permintaan terlebih dahulu!');
        if (query.includes('http')) query = query.split('/').pop();

        await insta.authBySessionId(client.config.instaAuth);
        const data = await insta.getProfile(query);
        if (!data) return message.reply('Data tidak ditemukan!');

        const embed = new Discord.MessageEmbed()
            .setColor('#C13584')
            .setAuthor(`${data.name}`, 'https://cdn.discordapp.com/emojis/335186186718937098.png', data.link)
            .setDescription(data.bio)
            .addField('Posts', `${data.posts}`, true)
            .addField('Followers', `${data.followers}` ? `${data.followers}` : '-', true)
            .addField('Following', `${data.following}` ? `${data.following}` : '-', true)
            .addField('Private', data.private ? 'Ya' : 'Tidak', true)
            .addField('Verified', data.verified ? 'Ya' : 'Tidak', true)
            .addField('Website', data.website, true)
            .setImage(data.pic)

        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('See Recent Post 📜')
                    .setStyle('SECONDARY')
                    .setCustomId(`post-${message.id}`),
                new Discord.MessageButton()
                    .setLabel('Redirect to Instagram')
                    .setStyle('LINK')
                    .setURL(`https://instagram.com/${query}`)
            )

        const m = await message.channel.send({ embeds: [embed], components: [button] });
        const collector = m.channel.createMessageComponentCollector(msg => msg.author.id === message.author.id && msg.componentType === 'button', { time: 60000 });
        collector.on('collect', async (i) => {
            if (i.customId !== `post-${message.id}`) return;

            const postData = data.lastPosts ? data.lastPosts : 'Tidak ada';
            if (!postData) return;

            let pagination = 1;
            const timestamp = moment.unix(postData[pagination - 1].timestamp);

            const postbed = new Discord.MessageEmbed()
                .setAuthor(data.name, data.pic, data.link)
                .setDescription(client.util.truncate(postData[0].caption))
                .setColor('C13584')
                .setImage(postData[0].thumbnail)
                .addField('Likes', `${postData[0].likes}`, true)
                .addField('Comments', `${postData[0].comments}`, true)
                .addField('Date', timestamp.format('dddd, MMMM Do YYYY, HH:mm:ss'), true)
                .setFooter(`Post ${pagination} of ${postData.length} posts`)

            const btn = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setLabel('< Back')
                        .setStyle('SECONDARY')
                        .setCustomId(`post-${message.id}-back`),
                    new Discord.MessageButton()
                        .setLabel('Next >')
                        .setStyle('SECONDARY')
                        .setCustomId(`post-${message.id}-next`),
                    new Discord.MessageButton()
                        .setLabel('Delete')
                        .setStyle('DANGER')
                        .setCustomId(`post-${message.id}-delete`)
                );

            const r = await message.channel.send({ embeds: [postbed], components: [btn] });
            const collector2 = r.channel.createMessageComponentCollector(msg => msg.author.id === message.author.id && msg.componentType === 'button', { time: 60000 });
            collector2.on('collect', async (j) => {
                switch (j.customId) {
                    case `post-${message.id}-back`:
                        if (pagination === 1) return;
                        pagination--;

                        postbed.setDescription(client.util.truncate(postData[pagination - 1].caption));
                        postbed.setImage(postData[pagination - 1].thumbnail);
                        postbed.fields = [
                            {
                                name: 'Likes',
                                value: postData[pagination - 1].likes.toLocaleString(),
                                inline: true
                            },
                            {
                                name: 'Comments',
                                value: postData[pagination - 1].comments.toLocaleString(),
                                inline: true
                            },
                            {
                                name: 'Date',
                                value: moment.unix(postData[pagination - 1].timestamp).format('dddd, MMMM Do YYYY, HH:mm:ss'),
                                inline: true
                            }
                        ];
                        postbed.setFooter(`Image ${pagination} of ${postData.length} images`);

                        r.edit({ embeds: [postbed], components: [btn] });
                        break;

                    case `post-${message.id}-next`:
                        if (pagination === postData.length) return;
                        pagination++;

                        postbed.setDescription(client.util.truncate(postData[pagination - 1].caption));
                        postbed.setImage(postData[pagination - 1].thumbnail);
                        postbed.fields = [
                            {
                                name: 'Likes',
                                value: postData[pagination - 1].likes.toLocaleString(),
                                inline: true
                            },
                            {
                                name: 'Comments',
                                value: postData[pagination - 1].comments.toLocaleString(),
                                inline: true
                            },
                            {
                                name: 'Date',
                                value: moment.unix(postData[pagination - 1].timestamp).format('dddd, MMMM Do YYYY, HH:mm:ss'),
                                inline: true
                            }
                        ];
                        postbed.setFooter(`Post ${pagination} of ${postData.length} posts`);

                        r.edit({ embeds: [postbed], components: [btn] });
                        break;

                    case `post-${message.id}-delete`:
                        r.delete();
                        break;
                }

                await j.deferUpdate();
            });
        });
    } catch (err) {
        message.channel.send(`Something Went Wrong:\n${err.message}`);
        console.log(err);
    }
};

exports.conf = {
    aliases: ['ig'],
    cooldown: '5',
    location: __filename
}

exports.help = {
    name: 'instagram',
    description: 'Search Instagram User',
    usage: 'instagram <query>'
}