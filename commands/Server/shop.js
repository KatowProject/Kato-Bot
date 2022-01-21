const Discord = require('discord.js');
const db = require('../../database/schema/Shop');

exports.run = async (client, message, args) => {
    try {
        if (!message.member.roles.cache.has('438335830726017025') && !message.member.roles.cache.has('589047055360589824')) return message.reply('Kamu tidak memiliki role untuk menggunakan command ini!');

        const items = await db.find({});
        const buttons = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton().setLabel('🛒').setStyle('PRIMARY').setCustomId(`buy-${message.id}`)
            ]);

        const r = await message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle('Kato Shop')
                    .setDescription(items.map((a, i) => `**${i + 1}. ${a.name}** - \`${a.price}\` Tickets - ${a.stock} Items Available`).join('\n'))
                    .setColor('RANDOM')
                    .setFooter(`Total items: ${items.length}`)
                    .setTimestamp()
            ],
            components: [buttons]
        });

        const collector = r.channel.createMessageComponentCollector(m => m.user.id === message.author.id, { time: 60000 });
        collector.on('collect', async (m) => {
            await m.deferUpdate();
            switch (m.customId) {
                case `buy-${message.id}`:
                    break;
            }
        });
    } catch (e) { // deepscan-disable-line
        message.channel.send(`Error: ${e.message}`);
    }
};


exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'shop',
    description: 'Menampilkan daftar item yang tersedia',
    usage: 'shop',
    example: 'shop'
}