const Discord = require('discord.js');
const instaClient = require('scraper-instagram');
const insta = new instaClient();
const { MessageButton } = require('discord-buttons');
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
            .addField('Posts', data.posts, true)
            .addField('Followers', data.followers ? data.followers : '-', true)
            .addField('Following', data.following ? data.following : '-', true)
            .addField('Private', data.private ? 'Ya' : 'Tidak', true)
            .addField('Verified', data.verified ? 'Ya' : 'Tidak', true)
            .addField('Website', data.website, true)
            .setImage(data.pic)
        const postButton = new MessageButton().setStyle('grey').setLabel('See Recent Post 📜').setID('postID');
        const redirect = new MessageButton().setStyle('url').setLabel('Redirect to Instagram').setURL('https://instagram.com/' + query);
        let msgBed = await message.channel.send({ embed, buttons: [postButton, redirect] });

        const hcollector = msgBed.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 500000 });
        hcollector.on('collect', async (f) => {
            f.reply.defer();
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

            const backwardsButton = new MessageButton().setStyle('grey').setLabel('< Back').setID('backID');
            const deleteButton = new MessageButton().setStyle('red').setLabel('♻').setID('deleteID');
            const forwardsButton = new MessageButton().setStyle('grey').setLabel('Next >').setID('nextID');
            const buttonList = [backwardsButton, deleteButton, forwardsButton];
            let r = await message.channel.send({ embed: postbed, buttons: client.util.buttonPageFilter(buttonList, postData.length, pagination) });

            const collector = r.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 500000 });
            collector.on('collect', (button) => {
                button.reply.defer();
                switch (button.id) {
                    case 'backID':
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

                        r.edit({ embed: postbed, buttons: client.util.buttonPageFilter(buttonList, postData.length, pagination) });
                        break;

                    case 'deleteID':
                        r.delete();
                        break;

                    case 'nextID':
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

                        r.edit({ embed: postbed, buttons: client.util.buttonPageFilter(buttonList, postData.length, pagination) });
                        break;
                }
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