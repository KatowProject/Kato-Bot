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

        await insta.authBySessionId('2147862687%3AiuDGiNay0S2ze6%3A6');
        const data = await insta.getProfile(query);
        if (!data) return message.reply('Data tidak ditemukan!');

        const embed = new Discord.MessageEmbed()
            .setColor('#C13584')
            .setAuthor(`${data.name}`, 'https://cdn.discordapp.com/emojis/335186186718937098.png', data.link)
            .setDescription(data.bio)
            .addField('Posts', data.posts, true)
            .addField('Followers', data.followers ? data.followers : '-', true)
            .addField('Following', data.following ? data.following : '-', true)
            .addField('Private', data.private ? 'Ya' : 'Tidak', true)
            .addField('Verified', data.verified ? 'Ya' : 'Tidak', true)
            .addField('Website', data.website, true)
            .setImage(data.pic)

        let msgBed = await message.channel.send(embed);
        await msgBed.react('📑');

        const seeLastPost = (reaction, user) => reaction.emoji.name === '📑' && user.id === message.author.id;
        const post = msgBed.createReactionCollector(seeLastPost);

        post.on('collect', async (f) => {

            const postData = data.lastPosts ? data.lastPosts : 'Tidak ada';
            if (!postData) return;

            let pagination = 1;
            const timestamp = moment.unix(postData[pagination - 1].timestamp);

            const postbed = new Discord.MessageEmbed()
                .setAuthor(data.name, data.pic, data.link)
                .setDescription(client.util.truncate(postData[0].caption))
                .setColor('C13584')
                .setImage(postData[0].thumbnail)
                .addField('Likes', postData[0].likes, true)
                .addField('Comments', postData[0].comments, true)
                .addField('Date', timestamp.format('dddd, MMMM Do YYYY, HH:mm:ss'), true)
                .setFooter(`Post ${pagination} of ${postData.length} posts`)

            let msgPost = await message.channel.send(postbed);
            msgPost.react('👈');
            msgPost.react('♻');
            msgPost.react('👉');

            const backwardsFilter = (reaction, user) =>
                reaction.emoji.name === `👈` && user.id === message.author.id;
            const deleteFilter = (reaction, user) =>
                reaction.emoji.name === `♻` && user.id === message.author.id;
            const forwardsFilter = (reaction, user) =>
                reaction.emoji.name === `👉` && user.id === message.author.id;

            const backwards = msgPost.createReactionCollector(backwardsFilter);
            const deletes = msgPost.createReactionCollector(deleteFilter);
            const forwards = msgPost.createReactionCollector(forwardsFilter);

            backwards.on('collect', (f) => {

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
                postbed.setFooter(`Post ${pagination} of ${postData.length} posts`);
                msgPost.edit(postbed);

            })

            deletes.on('collect', (f) => {
                msgPost.delete();
            })

            forwards.on("collect", (f) => {

                if (pagination == postData.length) return;
                pagination++;

                postbed.setAuthor(data.name, data.pic, data.link)
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
                postbed.setFooter(`Post ${pagination} of ${postData.length} posts`)
                msgPost.edit(postbed);
            });

        });

    } catch (error) {
        console.log(error);
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual. 
    }
}

exports.conf = {
    aliases: ['insta', 'instagra', 'ig'],
    cooldown: 5
}

exports.help = {
    name: 'instagram',
    description: 'Menampilkan profile instagram',
    usage: 'instagram <url/username>',
    example: 'instagram pos.total'
}