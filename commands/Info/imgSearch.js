const Discord = require('discord.js');
const gis = require('g-i-s')

exports.run = async (client, message, args) => {
    try {

        gis(args.join(' '), logResults);
        async function logResults(error, results) {
            if (error) {
                message.reply(`sepertinya gagal mendapatkannya :(\`\`\`\n${error}\`\`\``)
                console.log(error);
            }
            else {
                let array = [];
                results.forEach(a => {
                    array.push(a.url)
                });
                return await imageList(message, array);
            }
        }

        async function imageList(message, results) {
            if (results < 1) return message.reply(`Pencarian \`${args.join(' ')}\` tidak ditemukan!`);
            let pagination = 1
            let embed = new Discord.MessageEmbed()
                .setColor(client.warna.kato)
                .setTitle(`Hasil Pencarian \`${args.join(' ')}\``)
                .setImage(results[pagination - 1])
                .setFooter(`Image ${pagination} of ${results.length} images`)
            let r = await message.channel.send(embed);
            r.react('👈');
            r.react('♻');
            r.react('👉');

            const backwardsFilter = (reaction, user) =>
                reaction.emoji.name === `👈` && user.id === message.author.id;
            const deleteFilter = (reaction, user) =>
                reaction.emoji.name === `♻` && user.id === message.author.id;
            const forwardsFilter = (reaction, user) =>
                reaction.emoji.name === `👉` && user.id === message.author.id;

            const backwards = r.createReactionCollector(backwardsFilter);
            const deletes = r.createReactionCollector(deleteFilter);
            const forwards = r.createReactionCollector(forwardsFilter);

            backwards.on('collect', (f) => {
                if (pagination === 1) return;
                pagination--;
                embed.setImage(results[pagination - 1]);
                embed.setFooter(`Image ${pagination} of ${results.length} Images`)
                r.edit(embed);

            })

            deletes.on('collect', (f) => {
                r.delete();
            })

            forwards.on("collect", (f) => {
                if (pagination == results.length) return;
                pagination++;
                embed.setImage(results[pagination - 1]);
                embed.setFooter(`Image ${pagination} of ${results.length} Images`);
                r.edit(embed);
            });

        };



    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}



exports.conf = {
    aliases: ["imgsearch"],
    cooldown: 10
}

exports.help = {
    name: 'img',
    description: 'menambahkan status afk pada user',
    usage: 'k!avatar [mention/userid/server]',
    example: 'k!avatar @juned | k!avatar 458342161474387999 | k!avatar server'
}