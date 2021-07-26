const Discord = require('discord.js');
const axios = require('axios');
const { MessageButton } = require('discord-buttons');

exports.run = async (client, message, args) => {
    try {

        const req = parseInt(args[0]) ? parseInt(args[0]) : 1;
        const res = await axios.get('https://mee6.xyz/api/plugins/levels/leaderboard/336336077755252738?page=' + (req - 1));

        const response = res.data;

        const mappingLB = response.players.map((a, i) => `${i + 1}. \`${a.username}#${a.discriminator}\` **[Level ${a.level} | ${a.xp} EXP]**`);
        const chunkLB = client.util.chunk(mappingLB, 20);

        let pagination = 1;
        const embed = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setTitle('Leaderboard MEE6')
            .setAuthor(message.guild.name, message.guild.iconURL(), response.guild.leaderboard_url)
            .setDescription(chunkLB[0].join('\n'))
            .setFooter(`Page ${pagination} of ${chunkLB.length} | Bagian ${req}`)

        const backwardsButton = new MessageButton().setStyle('grey').setLabel('< Back').setID('backID');
        const deleteButton = new MessageButton().setStyle('red').setLabel('♻').setID('deleteID');
        const forwardsButton = new MessageButton().setStyle('grey').setLabel('Next >').setID('nextID');
        const buttonList = [backwardsButton, deleteButton, forwardsButton];
        let r = await message.channel.send({ embed, buttons: client.util.buttonPageFilter(buttonList, chunkLB.length, pagination) });

        const collector = r.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 500000 });
        collector.on('collect', (button) => {
            button.reply.defer();
            switch (button.id) {
                case 'backID':
                    if (pagination === 1) return;
                    pagination--;

                    embed.setDescription(chunkLB[pagination - 1].join('\n'));
                    embed.setFooter(`Page ${pagination} of ${chunkLB.length} | Bagian ${req}`);

                    r.edit({ embed, buttons: client.util.buttonPageFilter(buttonList, chunkLB.length, pagination) });
                    break;

                case 'deleteID':
                    r.delete();
                    break;

                case 'nextID':
                    if (pagination === chunkLB.length) return;
                    pagination++;

                    embed.setDescription(chunkLB[pagination - 1].join('\n'));
                    embed.setFooter(`Page ${pagination} of ${chunkLB.length} | Bagian ${req}`);

                    r.edit({ embed, buttons: client.util.buttonPageFilter(buttonList, chunkLB.length, pagination) });
                    break;
            }
        });
    } catch (error) {
        message.reply('Something went wrong: ' + error.message);
    }
}


exports.conf = {
    aliases: ['lb'],
    cooldown: 60
}


exports.help = {
    name: 'leaderboard',
    description: 'lihat peringkat di mee6',
    usage: 'leaderboard [page]',
    example: 'leaderboard 1'
}