const Discord = require('discord.js');
const gis = require('g-i-s');
const { MessageButton } = require('discord-buttons');

exports.run = async (client, message, args) => {
    try {
        gis(args.join(' '), async (error, results) => {
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

        })

        async function imageList(message, results) {
            if (results < 1) return message.reply(`Pencarian \`${args.join(' ')}\` tidak ditemukan!`);
            let pagination = 1
            let embed = new Discord.MessageEmbed()
                .setColor(client.warna.kato)
                .setTitle(`Hasil Pencarian \`${args.join(' ')}\``)
                .setImage(results[pagination - 1])
                .setFooter(`Image ${pagination} of ${results.length} images`);

            const backwardsButton = new MessageButton().setStyle('grey').setLabel('< Back').setID('backID');
            const deleteButton = new MessageButton().setStyle('red').setLabel('♻').setID('deleteID');
            const forwardsButton = new MessageButton().setStyle('grey').setLabel('Next >').setID('nextID');
            const buttonList = [backwardsButton, deleteButton, forwardsButton];
            let r = await message.channel.send({ embed, buttons: client.util.buttonPageFilter(buttonList, results.length, pagination) });

            const collector = r.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 500000 });
            collector.on('collect', (button) => {
                button.reply.defer();
                switch (button.id) {
                    case 'backID':
                        if (pagination === 1) return;
                        pagination--;
                        embed.setImage(results[pagination - 1]);
                        embed.setFooter(`Image ${pagination} of ${results.length} images`);
                        r.edit({ embed, buttons: client.util.buttonPageFilter(buttonList, results.length, pagination) });
                        break;

                    case 'deleteID':
                        r.delete();
                        break;

                    case 'nextID':
                        if (pagination === results.length) return;
                        pagination++;
                        embed.setImage(results[pagination - 1]);
                        embed.setFooter(`Image ${pagination} of ${results.length} images`);
                        r.edit({ embed, buttons: client.util.buttonPageFilter(buttonList, results.length, pagination) });
                        break;
                }
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