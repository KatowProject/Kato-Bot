const Discord = require('discord.js');
const nao = require('saucenao');
require('file-type');

exports.run = async (client, message, args) => {

    try {

        let sauce;
        if (message.attachments.size > 0) {
            // Last Message ID
            let mAuthor = message.author.lastMessageID;
            // Get Last Message ID
            let message_id = message.channel.messages.cache.get(`${mAuthor}`);
            // Attachment ID
            let gAttachment = message_id.attachments.map(file => file.id);
            // Get Attachment ID
            let attachment_id = message_id.attachments.get(`${gAttachment}`);
            // URL Images
            sauce = (await nao(attachment_id.url)).json;

        } else {
            sauce = (await nao(args.join(' '))).json;
        }

        /* Get Header n Data*/
        let temp = [];
        i = 0;
        while (i < sauce.results.length) {
            let header = sauce.results[i].header;
            let data = sauce.results[i].data;

            /* embed */
            let embed = new Discord.MessageEmbed()
                .setTitle('Kato x SauceNao')
                .setImage(header.thumbnail)
                .setColor(client.warna.kato)
                .setFooter('Page 1 of ' + sauce.results.length + ' Pages')

            for (const [key, value] of Object.entries(header)) {
                if (['thumbnail', 'dupes', 'index_id'].includes(key)) continue;
                embed.addField(key ? key : 'no name', value ? value : '-', true);
            }
            for (const [key, value] of Object.entries(data)) {
                if (key == 'ext_urls') continue;
                embed.addField(key ? key : 'no name', value ? value : '-', true);
            }
            temp.push(embed);
            i++;
        }
        let page = 1;
        let r = await message.channel.send(temp[page - 1]);
        await r.react('👈');
        await r.react('👉');

        const backwardsFilter = (reaction, user) =>
            reaction.emoji.name === `👈` && user.id === message.author.id;
        const forwardsFilter = (reaction, user) =>
            reaction.emoji.name === `👉` && user.id === message.author.id;

        const backwards = r.createReactionCollector(backwardsFilter);
        const forwards = r.createReactionCollector(forwardsFilter);

        backwards.on('collect', (f) => {
            if (page == 1) return;
            page--;
            temp[page - 1].footer = {
                text: `Page ${page} of ${temp.length}`
            }
            r.edit(temp[page - 1]);

        })

        forwards.on("collect", (f) => {
            if (page == temp.length) return;
            page++;
            temp[page - 1].footer = {
                text: `Page ${page} of ${temp.length}`
            }
            r.edit(temp[page - 1]);
        })


    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual. 
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'sauce',
    description: 'nyari saus doujin',
    usage: 'sauce',
    example: 'sauce'
}