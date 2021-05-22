const Discord = require('discord.js');
const ms = require('ms');
const donate = require('../../database/schema/Donatur');

exports.run = async (client, message, args) => {
    try {

        const option = args[0];

        switch (option) {
            case 'saldo':

                if (!message.member.hasPermission('MANAGE_MESSAGES')) return;
                const getSaldo = await client.trakteer.getSaldo();
                console.log(getSaldo)
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('Cek Saldo Trakteer')
                    .setColor(client.warna.kato)
                    .addField('Saldo', getSaldo)
                    .setFooter(`trakter.id/santai`, message.guild.iconURL())
                );

                break;

            case 'data':

                if (!message.member.hasPermission('MANAGE_MESSAGES')) return;
                const getData = await client.trakteer.getData();
                if (getData.length < 1) return message.channel.send('Tidak ada data yang ditemukan!');

                let pagination = 1;
                const dataDonet = [];

                getData.forEach((a, i) => {
                    const type = typeof a.support_message;
                    if (type === 'object') a.support_message.pop();

                    dataDonet.push(`**${i + 1}. ${a.supporter}**`);
                });

                const chunk = client.util.chunk(dataDonet, 10);
                const embed = new Discord.MessageEmbed()
                    .setTitle('Data Donatur Perkumpulan Orang Santai')
                    .setColor(client.warna.kato)
                    .setDescription(chunk[pagination - 1].join('\n'))
                    .setFooter('Pilih menggunakan angka untuk melanjutkan!');

                const donaturMSG = await message.channel.send(embed);
                await donaturMSG.react('👈');
                await donaturMSG.react('♻');
                await donaturMSG.react('👉');

                const backwardsFilter = (reaction, user) =>
                    reaction.emoji.name === `👈` && user.id === message.author.id;
                const deleteEmbed = (reaction, user) =>
                    reaction.emoji.name === `♻` && user.id === message.author.id;
                const forwardsFilter = (reaction, user) =>
                    reaction.emoji.name === `👉` && user.id === message.author.id;

                const backwards = donaturMSG.createReactionCollector(backwardsFilter);
                const embedDelete = donaturMSG.createReactionCollector(deleteEmbed);
                const forwards = donaturMSG.createReactionCollector(forwardsFilter);

                backwards.on('collect', (f) => {
                    if (pagination === 1) return;
                    pagination--;
                    embed.setDescription(chunk[pagination - 1].join('\n'));
                    donaturMSG.edit(embed);

                });

                embedDelete.on('collect', (f) => {
                    donaturMSG.delete();
                });

                forwards.on('collect', (f) => {
                    if (pagination == chunk.length) return;
                    pagination++;
                    embed.setDescription(chunk[pagination - 1].join('\n'));
                    donaturMSG.edit(embed);
                });

                break;

            case 'status':

                if (args.includes('--all')) {

                    const allDonatur = await donate.find({})

                    const mapDonatur = allDonatur.map((a, i) => {

                        const timeLeft = a.duration - (Date.now() - a.now);
                        const member = message.guild.members.cache.get(a.userID);
                        return `**${i + 1}**. <@${member.id}> - **${member.user.tag}**\n\`${client.util.parseDur(timeLeft)}\``;

                    });

                    const chunkDonatur = client.util.chunk(mapDonatur, 10);

                    let pagination = 1;
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Durasi Role Donatur [Total]')
                        .setAuthor('Perkumpulan Orang Santai', message.guild.iconURL(), 'https://trakteer.id/santai')
                        .setDescription(chunkDonatur[0].join('\n'))
                        .setColor(client.warna.kato)
                        .setTimestamp()

                    const donaturMSG = await message.channel.send(embed);
                    donaturMSG.react('👈');
                    donaturMSG.react('♻')
                    donaturMSG.react('👉');

                    const backwardsFilter = (reaction, user) =>
                        reaction.emoji.name === `👈` && user.id === message.author.id;
                    const deleteEmbed = (reaction, user) =>
                        reaction.emoji.name === `♻` && user.id === message.author.id;
                    const forwardsFilter = (reaction, user) =>
                        reaction.emoji.name === `👉` && user.id === message.author.id;

                    const backwards = donaturMSG.createReactionCollector(backwardsFilter);
                    const embedDelete = donaturMSG.createReactionCollector(deleteEmbed);
                    const forwards = donaturMSG.createReactionCollector(forwardsFilter);

                    backwards.on('collect', (f) => {
                        if (pagination === 1) return;
                        pagination--;
                        embed.setDescription(chunkDonatur[pagination - 1].join('\n'));
                        donaturMSG.edit(embed);

                    });

                    embedDelete.on('collect', (f) => {
                        donaturMSG.delete();
                    });

                    forwards.on('collect', (f) => {
                        if (pagination == chunkDonatur.length) return;
                        pagination++;
                        embed.setDescription(chunkDonatur[pagination - 1].join('\n'));
                        donaturMSG.edit(embed);
                    });



                } else {

                    const donatur = await donate.findOne({ userID: message.author.id })
                    if (!donatur) return message.channel.send('datanya tidak ada!');
                    const timeLeft = donatur.duration - (Date.now() - donatur.now);
                    message.channel.send(`Waktu role mu tersisa **${client.util.parseDur(timeLeft)}**`);

                }

                break;

            case 'apply':

                if (!message.member.hasPermission('MANAGE_MESSAGES')) return;
                if (!args[1]) return message.reply('Masukkan waktu/durasi telebih dahulu!');

                const ya = ['ya', 'bener', 'betul', 'ok'];
                const tidak = ['ga', 'salah', 'invalid', 'gk', 'tidak'];

                const time = ms(args[1]);
                if (!time) return message.reply('Nilai yang dimasukkan invalid, silahkan buat permintaan kembali!');

                const findMember = message.mentions.members.first() || message.guild.members.cache.get(args[2]);
                if (!findMember) return message.reply('User tidak ditemukan!');

                const donetBed = new Discord.MessageEmbed()
                    .setColor(client.warna.kato)
                    .setAuthor(findMember.user.tag, findMember.user.avatarURL({ dynamic: true, size: 4096 }))
                    .addField('ID: ', findMember.id, true)
                    .addField('Tag: ', findMember.user.tag, true)
                    .addField('Nickname:', findMember.nickname, true)

                const applyMSG = await message.channel.send(donetBed);
                const alertMSG = await message.reply(`Apakah user sudah sesuai dengan data?\n**Setuju**: ${ya.join(', ')}\n**Tidak Setuju**: ${tidak.join(', ')}`);
                const awaitingMSG = await message.channel.awaitMessages((m) => m.content.toLowerCase() && m.author.id === message.author.id, {
                    max: 1,
                    time: 20000,
                    errors: ["time"]
                }).catch((err) => {

                    applyMSG.delete();
                    alertMSG.delete();
                    return message.reply('Waktu telah habis, silahkan buat permintaan kembali!');

                });

                if (ya.includes(awaitingMSG.first().content.toLowerCase())) {
                    alertMSG.delete();
                    const alreadyDonet = await donate.findOne({ userID: findMember.id });
                    if (alreadyDonet) {

                        message.reply('Data telah disetujui dan Durasi Role diakumulasikan dengan sekarang, silahkan cek kembali untuk memastikan!');
                        await donate.findOneAndUpdate({ userID: findMember.id }, { userID: findMember.id, guild: message.guild.id, duration: alreadyDonet.duration + time, now: alreadyDonet.now });

                    } else {

                        message.reply('Data telah disetujui dan telah masuk ke dalam Database, silahkan cek kembali untuk memastikan!');
                        await findMember.roles.add('438335830726017025');
                        await donate.create({ userID: findMember.id, guild: message.guild.id, duration: time, now: Date.now() });

                    }
                } else if (tidak.includes(awaitingMSG.first().content.toLowerCase())) {
                    alertMSG.delete();
                    message.reply('Dibatalkan karena Data tidak disetujui!');
                } else message.reply('Argumen tidak dimengerti oleh Kato, silahkan buat permintaan kembali!');


                break;

            default:
                const defaultEmbed = new Discord.MessageEmbed()
                    .setColor(client.warna.kato)
                    .setTitle('List Opsi Trakteer')
                    .addField('saldo', 'ngecek saldo')
                    .addField('status | status --all', 'lihat durasi role donatur')
                    .addField('data', 'lihat data donatur dari awal hingga sekarang')
                    .addField('apply', 'memberikan role kepada donatur yang tidak terpasang secara otomatis')
                message.channel.send(defaultEmbed);
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
    cooldown: 5
}

exports.help = {
    name: 'trakteer',
    description: 'perintah trakteer',
    usage: 'trakteer',
    example: 'trakteer'
}