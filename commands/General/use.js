const Discord = require('discord.js');
const { MessageButton } = require('discord-buttons');
const dbUser = require('../../database/schema/event');

exports.run = async (client, message, args) => {
    const isParticipant = await dbUser.findOne({ userID: message.author.id });
    if (!isParticipant) return message.channel.send('Kamu bukan partisipan.');
    const items = isParticipant.items;

    const embed = new Discord.MessageEmbed().setColor('#0099ff').setTitle('Item Tersedia')
    if (items.length > 0) {
        embed.setDescription(`${items.map((item, i) => `${i + 1}. ${item.name} | ${item.isPending ? 'Pending' : item.used ? 'Sudah digunakan' : 'Ready'}`)}.join('\n')}`);
    } else {
        embed.setDescription('Tidak ada item tersedia.');
    }
    message.channel.send(embed);
    let r = await message.reply('Pilih menggunakan angka untuk mengklaim!');

    const collector = await message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 60000 });
    collector.on('collect', async (m) => {
        if (m.content === 'cancel') {
            collector.stop();
            return message.channel.send('Dibatalkan!');
        }
        if (!m.content.match(/\d+/)) return message.reply('Masukkan angka yang valid!');

        const index = parseInt(m.content) - 1;
        if (index < 0 || index >= items.length) return message.reply('Masukkan angka yang valid!');
        r.delete();

        const item = items[index];
        requireItem(item);
        collector.stop();
    });

    async function requireItem(item) {
        if (item.isPending) return message.reply('Item sedang status Pending!');
        let repl = await message.reply('Apakah kamu sudah yakin? **ya** | **cancel**');

        const collector = await message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 60000 });
        collector.on('collect', async (m) => {
            if (m.content === 'cancel') {
                collector.stop();
                return message.channel.send('Cancelled!');
            }

            if (m.content === 'ya') {
                collector.stop();
                repl.delete();

                const embed = new Discord.MessageEmbed().setColor('#0099ff').setTitle('Permintaan Hadiah')
                embed.setDescription(`User: ${m.author.tag}\nMentioned: <@${m.author.id}>\nID: ${m.author.id}\nItem: ${item.name}\nStatus: Menunggu`);
                const buttonAccept = new MessageButton().setStyle('green').setLabel('✔').setID('acceptID');
                const buttonReject = new MessageButton().setStyle('red').setLabel('✖').setID('rejectID');

                client.channels.cache.get('894853662629834772').send({ embed, buttons: [buttonAccept, buttonReject] });
                const _item = items.indexOf(item);
                items[_item].isPending = true;

                await dbUser.findOneAndUpdate({ userID: message.author.id }, { items });
                return message.reply('Permintaaan barang sudah diterima, tunggu Staff Memberikan Hadiahnya!');
            }

            message.reply(`Jika sudah yakin ketik **ya**, jika tidak ketik **cancel**`).then(a => a.delete({ timeout: 10000 }));
        });
    }

};

exports.conf = {
    cooldown: 5,
    aliases: [],
}

exports.help = {
    name: 'use',
    description: 'Use a items',
    usage: 'use <item>',
    example: 'use <item>'
}