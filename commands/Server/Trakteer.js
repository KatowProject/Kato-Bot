const Discord = require('discord.js');
const { Permissions } = Discord;
const ms = require('ms');
const donate = require('../../database/schema/Donatur');

exports.run = async (client, message, args) => {
    try {
        const option = args[0];
        switch (option) {
            case 'saldo':
                if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;
                const getSaldo = await client.trakteer.getSaldo();
                message.channel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle('Cek Saldo Trakteer')
                        .setColor('RANDOM')
                        .addField('Saldo', getSaldo)
                        .setFooter(`trakter.id/santai`, message.guild.iconURL())
                    ]
                });
                break;

            case 'data':
                if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;
                const getData = await client.trakteer.getData();
                if (getData.length < 1) return message.channel.send('Tidak ada data yang ditemukan!');

                let pagination = 1;
                const chunk = client.util.chunk(getData.map((a, i) => `**${i + 1}. ${a.supporter}** | \`ID: ${a.id}\``), 15);
                const embed = new Discord.MessageEmbed()
                    .setTitle('Data Donatur Perkumpulan Orang Santai')
                    .setColor('RANDOM')
                    .setDescription(chunk[pagination - 1].join('\n'))
                    .setFooter('Pilih menggunakan angka untuk melanjutkan!');

                const buttons = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setLabel('< Back').setStyle('SECONDARY').setCustomId(`back-${message.id}`),
                        new Discord.MessageButton()
                            .setLabel('🗑️').setStyle('DANGER').setCustomId(`delete-${message.id}`),
                        new Discord.MessageButton()
                            .setLabel('Next >').setStyle('SECONDARY').setCustomId(`next-${message.id}`),
                        new Discord.MessageButton()
                            .setLabel('Detail 📇').setStyle('SECONDARY').setCustomId(`detail-${message.id}`)
                    )
                let r = await message.channel.send({ embeds: [embed], components: [buttons] });
                const collector = r.channel.createMessageComponentCollector({ filter: msg => msg.user.id === message.author.id, time: 60000 });
                collector.on('collect', async (m) => {
                    await m.deferUpdate();

                    switch (m.customId) {
                        case `back-${message.id}`:
                            if (pagination === 1) return;
                            pagination--;

                            embed.setDescription(chunk[pagination - 1].join('\n'));
                            r.edit({ embeds: [embed], components: [buttons] });
                            break;

                        case `delete-${message.id}`:
                            r.delete();
                            break;

                        case `next-${message.id}`:
                            if (pagination === chunk.length) return;
                            pagination++;

                            embed.setDescription(chunk[pagination - 1].join('\n'));
                            r.edit({ embeds: [embed], components: [buttons] });
                            break;
                        case `detail-${message.id}`:
                            const msg = await message.channel.send('Silahkan pilih data yang ingin dilihat!');
                            const awaitMessages = await message.channel.awaitMessages({ filter: msg => msg.author.id === message.author.id, max: 1, time: 60_000, errors: ['time'] });
                            let data = awaitMessages.first();
                            if (!parseInt(data.content)) return msg.edit('Pilihan tidak valid!');

                            data = await client.trakteer.getOrderDetail(getData[data.content - 1].id);
                            if (!data) return msg.edit('Data tidak ditemukan!');

                            msg.edit({
                                content: 'Detail Data',
                                embeds: [
                                    new Discord.MessageEmbed()
                                        .setColor('RANDOM')
                                        .setTitle(`Detail Donasi ${data.nama}`)
                                        .addField('ID', data.orderId)
                                        .addField('Nama', data.nama)
                                        .addField('Nominal', data.nominal)
                                        .addField('Tanggal', data.tanggal)
                                        .addField('Pesan', data.message)
                                        .setFooter('trakter.id/santai', message.guild.iconURL())
                                        .setTimestamp()
                                ]
                            });
                            break;
                    }
                });
                break;

            case 'status':
                const user = message.guild.members.cache.find(a => a.user.tag.toLowerCase() == args.slice(1).join(' ').toLowerCase())
                    || message.mentions.members.first() || message.guild.members.cache.get(args[1]);

                if (user) {
                    const donatur = await donate.findOne({ userID: user.id ? user.id : user.user.id });
                    if (!donatur) return message.reply('Datanya tidak ada!');

                    const timeLeft = donatur.duration - (Date.now() - donatur.now);
                    message.channel.send(`Waktu role mu tersisa **${client.util.parseDur(timeLeft)}**`);
                } else if (args.includes('--all')) {
                    const allDonatur = await donate.find({})
                    const mapDonatur = allDonatur.map((a, i) => {
                        if (!a.now) return;
                        const timeLeft = a.duration - (Date.now() - a.now);
                        const member = message.guild.members.cache.get(a.userID);
                        if (!member) return;
                        return `**${i + 1}**. <@${member.id}> - **${member.user.tag}**\n\`${client.util.parseDur(timeLeft)}\``;
                    });
                    const chunkDonatur = client.util.chunk(mapDonatur, 10);

                    let pagination = 1;
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Durasi Role Donatur [Total]')
                        .setAuthor('Perkumpulan Orang Santai', message.guild.iconURL(), 'https://trakteer.id/santai')
                        .setDescription(chunkDonatur[0].join('\n'))
                        .setColor('RANDOM')
                        .setTimestamp()

                    const butonn = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setLabel('< Back').setStyle('SECONDARY').setCustomId(`back-${message.id}-all`),
                            new Discord.MessageButton()
                                .setLabel('🗑️').setStyle('DANGER').setCustomId(`delete-${message.id}-all`),
                            new Discord.MessageButton()
                                .setLabel('Next >').setStyle('SECONDARY').setCustomId(`next-${message.id}-all`)
                        )
                    let r = await message.channel.send({ embeds: [embed], components: [butonn] });

                    const collector = r.channel.createMessageComponentCollector({ filter: msg => msg.user.id === message.author.id, time: 60000 });
                    collector.on('collect', async (m) => {
                        await m.deferUpdate();
                        switch (m.customId) {
                            case `back-${message.id}-all`:
                                if (pagination === 1) return;
                                pagination--;
                                embed.setDescription(chunkDonatur[pagination - 1].join('\n'));
                                r.edit({ embeds: [embed], components: [butonn] });
                                break;

                            case `delete-${message.id}-all`:
                                r.delete();
                                break;

                            case `next-${message.id}-all`:
                                if (pagination === chunkDonatur.length) return;
                                pagination++;
                                embed.setDescription(chunkDonatur[pagination - 1].join('\n'));
                                r.edit({ embeds: [embed], components: [butonn] });
                                break;
                        }
                    });
                } else {
                    const donatur = await donate.findOne({ userID: message.author.id })
                    if (!donatur) return message.channel.send('datanya tidak ada!');
                    const timeLeft = donatur.duration - (Date.now() - donatur.now);
                    message.channel.send(`Waktu role mu tersisa **${client.util.parseDur(timeLeft)}**`);
                }
                break;

            case 'apply':
                if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;
                if (!args[1]) return message.reply('Masukkan waktu/durasi telebih dahulu!');

                const ya = ['ya', 'bener', 'betul', 'ok'];
                const tidak = ['ga', 'salah', 'invalid', 'gk', 'tidak'];

                const time = ms(args[1]);
                if (!time) return message.reply('Nilai yang dimasukkan invalid, silahkan buat permintaan kembali!');

                const findMember = message.mentions.members.first() || message.guild.members.cache.get(args[2]);
                if (!findMember) return message.reply('User tidak ditemukan!');

                const donetBed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(findMember.user.tag, findMember.user.avatarURL({ dynamic: true, size: 4096 }))
                    .addField('ID: ', `${findMember.id}`, true)
                    .addField('Tag: ', `${findMember.user.tag}`, true)
                    .addField('Nickname:', `${findMember.nickname}`, true)

                const applyMSG = await message.channel.send({ content: `Apakah user sudah sesuai dengan data?\n**Setuju**: ${ya.join(', ')}\n**Tidak Setuju**: ${tidak.join(', ')}`, embeds: [donetBed] });
                const collectora = await message.channel.createMessageCollector({ filter: m => m.author.id === message.author.id, time: 60_000 });
                collectora.on('collect', async m => {
                    if (tidak.includes(m.content)) return message.reply('Dibatalkan karena tidak disetujui!').then(() => { collectora.stop(); applyMSG.delete() });
                    if (!ya.includes(m.content)) return message.reply('Argumen tidak dimengerti oleh Kato!');

                    const alreadyDonet = await donate.findOne({ userID: findMember.id });
                    if (alreadyDonet) {
                        message.reply('Data telah disetujui dan Durasi Role diakumulasikan dengan sekarang, silahkan cek kembali untuk memastikan!');
                        await donate.findOneAndUpdate({ userID: findMember.id }, { duration: alreadyDonet.duration + time });
                    } else {
                        message.reply('Data telah disetujui dan telah masuk ke dalam Database, silahkan cek kembali untuk memastikan!');
                        await findMember.roles.add('932997958788608044');
                        await donate.create({ userID: findMember.id, guild: message.guild.id, duration: time, now: Date.now() });
                    }
                    applyMSG.delete();
                    collectora.stop();
                })
                break;

            default:
                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setTitle('List Opsi Trakteer')
                            .addField('saldo', 'ngecek saldo')
                            .addField('status | status --all', 'lihat durasi role donatur')
                            .addField('data', 'lihat data donatur dari awal hingga sekarang')
                            .addField('apply', 'memberikan role kepada donatur yang tidak terpasang secara otomatis')
                    ]
                });
                break;
        }
    } catch (error) {
        console.log(error);
        return message.reply('sepertinya ada kesalahan\n' + error.message)
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ['tr', 'trak'],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'trakteer',
    description: 'perintah trakteer',
    usage: 'trakteer',
    example: 'trakteer'
}