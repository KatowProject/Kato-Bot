const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {
    try {

        const req = parseInt(args[0]) ? parseInt(args[0]) : 1;
        const res = await axios.get('https://mee6.xyz/api/plugins/levels/leaderboard/336336077755252738?page=' + (req - 1));

        const response = res.data;

        const mappingLB = response.players.map((a, i) => `${i + 1}. \`${a.username}#${a.discriminator}\` **[Level ${a.level} | ${a.xp} EXP]**\n`);
        const chunkLB = client.util.chunk(mappingLB, 20);

        let pagination = 1;
        const embed = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setTitle('Leaderboard MEE6')
            .setAuthor(message.guild.name, message.guild.iconURL(), response.guild.leaderboard_url)
            .setDescription(chunkLB[0].join('\n'))
            .setFooter(`Page ${pagination} of ${chunkLB.length} | Bagian ${req}`)

        const msglb = await message.channel.send(embed);
        await msglb.react('👈');
        await msglb.react('♻');
        await msglb.react('👉');

        const backwards = msglb.createReactionCollector((reaction, user) => reaction.emoji.name === `👈` && user.id === message.author.id);
        const deletes = msglb.createReactionCollector((reaction, user) => reaction.emoji.name === '♻' && user.id === message.author.id);
        const forwards = msglb.createReactionCollector((reaction, user) => reaction.emoji.name === '👉' && user.id === message.author.id);

        backwards.on('collect', (f) => {

            if (pagination === 1) return;
            pagination--;

            embed.setDescription(chunkLB[pagination - 1].join('\n'));
            embed.setFooter(`Page ${pagination} of ${chunkLB.length} | Bagian ${req}`);

            msglb.edit(embed);

        });

        deletes.on('collect', (f) => msglb.delete());

        forwards.on('collect', (f) => {

            if (pagination === chunkLB.length) return;
            pagination++;

            embed.setDescription(chunkLB[pagination - 1].join('\n'));
            embed.setFooter(`Page ${pagination} of ${chunkLB.length} | Bagian ${req}`);

            msglb.edit(embed);

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