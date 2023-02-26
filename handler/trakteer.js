const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const moment = require('moment');
const ms = require('ms');
const donate = require('../database/schemas/Donatur');
const Trakteer = require('../modules/Trakteer');

class Donatur extends Trakteer {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        super({
            "trakteer-id-session": process.env.TRAKTEER_ID_SESSION,
            "XSRF-TOKEN": process.env.TRAKTEER_XSRF_TOKEN,
            "webhook": process.env.TRAKTEER_LOGS_WEBHOOK
        });
        this.client = client;
    }

    /**
     * Cek Saldo Donasi
     * @param {Message} message
    */
    async cekSaldo(message) {
        if (!message.member.permissions.has('ManageChannels')) return;
        const getSaldo = await this.getSaldo();
        const { saldo, current_donation } = getSaldo;
        const month = moment().format('MMMM');
        const embed = new EmbedBuilder()
            .setTitle(`Donasi Bulan ${month}`)
            .setDescription(`**Saldo:** ${saldo}\n**Donasi Bulan Ini:** ${current_donation}`)
            .setColor('Random')
            .setFooter({ text: 'trakteer.id/santai', iconURL: message.guild.iconURL() })

        message.channel.send({ embeds: [embed] });
    }

    /**
     * Cek Data Donatur
     * @param {Message} message
    */
    async cekDonatur(message) {
        const getData = await this.getData();
        if (getData.length < 1) return message.channel.send('Tidak ada data yang ditemukan!');

        let pagination = 1;
        const chunk = this.client.util.chunk(getData.map((a, i) => `**${i + 1}. ${a.supporter}** | \`ID: ${a.id}\``), 15);
        const embed = new EmbedBuilder()
            .setTitle('Data Donatur Perkumpulan Orang Santai')
            .setColor('Random')
            .setDescription(chunk[pagination - 1].join('\n'))
            .setFooter({ text: 'Pilih menggunakan angka untuk melanjutkan!' });

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('< Back').setStyle(ButtonStyle.Secondary).setCustomId(`back-${message.id}`),
                new ButtonBuilder()
                    .setLabel('🗑️').setStyle(ButtonStyle.Danger).setCustomId(`delete-${message.id}`),
                new ButtonBuilder()
                    .setLabel('Next >').setStyle(ButtonStyle.Secondary).setCustomId(`next-${message.id}`),
                new ButtonBuilder()
                    .setLabel('Detail 📇').setStyle(ButtonStyle.Secondary).setCustomId(`detail-${message.id}`)
            )
        const r = await message.channel.send({ embeds: [embed], components: [buttons] });
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

                    data = await this.client.trakteer.getOrderDetail(getData[data.content - 1].id);
                    if (!data) return msg.edit('Data tidak ditemukan!');

                    msg.edit({
                        content: 'Detail Data',
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Random')
                                .setTitle(`Detail Donasi ${data.nama}`)
                                .addFields(
                                    { name: 'ID', value: data.orderId },
                                    { name: 'Nama', value: data.nama },
                                    { name: 'Nominal', value: data.nominal },
                                    { name: 'Tanggal', value: data.tanggal },
                                    { name: 'Pesan', value: data.message }
                                )
                                .setFooter({ text: 'trakter.id/santai', iconURL: message.guild.iconURL() })
                                .setTimestamp()
                        ]
                    });
                    break;
            }
        });
    }

    /**
     * Cek Durasi Donatur
     * @param {Message} message 
     * @param {Array} args
     */
    async cekStatusDonasi(message, args) {
        const user = message.guild.members.cache.find(a => a.user.tag.toLowerCase() == args.slice(1).join(' ').toLowerCase())
            || message.mentions.members.first() || message.guild.members.cache.get(args[1]);

        if (user) {
            const donatur = await donate.findOne({ userID: user.id ? user.id : user.user.id });
            if (!donatur) return message.reply('Datanya tidak ada!');

            if (!donatur.now || !donatur.duration) return message.channel.send('Status mu adalah **Booster**');
            const timeLeft = donatur.duration - (Date.now() - donatur.now);
            message.channel.send(`Waktu role mu tersisa **${client.util.parseDur(timeLeft)}**`);
        } else if (args.includes('--all')) {
            const allDonatur = await donate.find({});
            if (allDonatur.length < 1) return message.channel.send('Tidak ada data yang ditemukan!');
            const member = await message.guild.members.fetch();
            const mapDonatur = allDonatur.map((a, i) => {
                const mem = member.find(b => b.id == a.userID);
                if (!a.now || !a.duration) return `**${i + 1}**. <@${mem.id}> - **${mem.user.tag}**\n\`Booster Duration\``;
                const timeLeft = a.duration - (Date.now() - a.now);
                if (!mem) return;
                return `**${i + 1}**. <@${mem.id}> - **${mem.user.tag}**\n\`${this.client.util.parseDur(timeLeft)}\``;
            });
            const chunkDonatur = this.client.util.chunk(mapDonatur, 10);

            let pagination = 1;
            const embed = new EmbedBuilder()
                .setTitle('Durasi Role Donatur [Total]')
                .setAuthor({ name: 'Perkumpulan Orang Santai', iconURL: message.guild.iconURL(), url: 'https://trakteer.id/santai' })
                .setDescription(chunkDonatur[0].join('\n'))
                .setColor('Random')
                .setTimestamp()

            const butonn = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('< Back').setStyle(ButtonStyle.Secondary).setCustomId(`back-${message.id}-all`),
                    new ButtonBuilder()
                        .setLabel('🗑️').setStyle(ButtonStyle.Danger).setCustomId(`delete-${message.id}-all`),
                    new ButtonBuilder()
                        .setLabel('Next >').setStyle(ButtonStyle.Secondary).setCustomId(`next-${message.id}-all`)
                )
            const r = await message.channel.send({ embeds: [embed], components: [butonn] });
            const collector = r.channel.createMessageComponentCollector({ filter: msg => msg.user.id === message.author.id && msg.customId.includes(message.id), time: 60000 });
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
            message.channel.send(`Waktu role mu tersisa **${this.client.util.parseDur(timeLeft)}**`);
        }
    }

    /**
     * Menambahkan Donatur
     * @param {Message} message 
     * @param {Array} args 
     */
    async applyDonatur(message, args) {
        if (!message.member.permissions.has('ManageChannels')) return;
        if (!args[1]) return message.reply('Masukkan waktu/durasi telebih dahulu!');

        const ya = ['ya', 'bener', 'betul', 'ok'];
        const tidak = ['ga', 'salah', 'invalid', 'gk', 'tidak'];

        let time = ms(args[1]);
        if (!time && args[1] === 'booster') time = Infinity;
        if (!time) return message.reply('Nilai yang dimasukkan invalid, silahkan buat permintaan kembali!');

        const findMember = message.mentions.members.first() || message.guild.members.cache.get(args[2]);
        if (!findMember) return message.reply('User tidak ditemukan!');

        const _time = time === Infinity ? 'Booster' : ms(time, { long: true });
        const donetBed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 4096 }) })
            .addFields(
                { name: 'Waktu:', value: `${_time}`, inline: true },
                { name: 'Tag: ', value: `${findMember.user.tag}`, inline: true },
                { name: 'Nickname:', value: `${findMember.nickname}`, inline: true }
            )
            .setFooter({ text: `ID: ${findMember.id}`, iconURL: findMember.user.avatarURL({ dynamic: true, size: 4096 }) })

        const applyMSG = await message.channel.send({ content: `Apakah user sudah sesuai dengan data?\n**Setuju**: ${ya.join(', ')}\n**Tidak Setuju**: ${tidak.join(', ')}`, embeds: [donetBed] });
        const collectora = message.channel.createMessageCollector({ filter: m => m.author.id === message.author.id, time: 60_000 });
        collectora.on('collect', async m => {
            if (tidak.includes(m.content)) return message.reply('Dibatalkan karena tidak disetujui!').then(() => { collectora.stop(); applyMSG.delete() });
            if (!ya.includes(m.content)) return message.reply('Argumen tidak dimengerti oleh Kato!');

            const donatur = await donate.findOne({ userID: findMember.id });
            if (time === Infinity && !donatur) {
                message.reply("Data telah disetujui dan telah masuk ke dalam Database, silahkan cek kembali untuk memastikan!");
                await donate.create({ userID: findMember.id, guild: message.guild.id, ticket: 0, isAttended: false, isBooster: true });

                this.client.emit('donaturManager', {
                    type: 'addDonaturBooster',
                    member: findMember,
                    guild: message.guild,
                    status: 'success',
                    reason: 'Booster'
                });

            } else if (donatur && !donatur.duration && !donatur.now) {
                message.reply('Data telah disetujui dan telah masuk ke dalam Database, silahkan cek kembali untuk memastikan!');
                await donate.findOneAndUpdate({ userID: findMember.id }, { duration: time, now: Date.now() });

                this.client.emit('donaturManager', {
                    type: 'addDonatur',
                    member: findMember,
                    guild: message.guild,
                    status: 'update',
                    reason: 'Donatur',
                    data: {
                        duration: time
                    }
                });
            } else if (donatur) {
                message.reply('Data telah disetujui dan Durasi Role diakumulasikan dengan sekarang, silahkan cek kembali untuk memastikan!');
                await donate.findOneAndUpdate({ userID: findMember.id }, { duration: donatur.duration + time });

                // check time is negative
                if (time < 0) {
                    this.client.emit('donaturManager', {
                        type: 'addDonatur',
                        member: findMember,
                        guild: message.guild,
                        status: 'reduce',
                        reason: 'Donatur',
                        data: {
                            duration: time
                        }
                    });
                } else {
                    this.client.emit('donaturManager', {
                        type: 'addDonatur',
                        member: findMember,
                        guild: message.guild,
                        status: 'extend',
                        reason: 'Donatur',
                        data: {
                            duration: time
                        }
                    });
                }
            } else {
                message.reply('Data telah disetujui dan telah masuk ke dalam Database, silahkan cek kembali untuk memastikan!');
                await findMember.roles.add('932997958788608044');
                await donate.create({ userID: findMember.id, guild: message.guild.id, duration: time, now: Date.now(), ticket: 0, isAttend: false });

                this.client.emit('donaturManager', {
                    type: 'addDonatur',
                    member: findMember,
                    guild: message.guild,
                    status: 'success',
                    reason: 'Donatur',
                    data: {
                        duration: time
                    }
                });
            }
            applyMSG.delete();
            collectora.stop();
        });
    }

    /**
     * 
     * @param {Message} message 
     * @param {[]} args 
     * @returns 
     */
    async cekHistoryKas(message, args) {
        if (!message.member.permissions.has('MANAGE_GUILD')) return;
        const getHistory = await this.getHistory();

        let pagination = 1;
        const map = getHistory.map((a, i) => `**${a.tanggal}**\n\`${a.description}\` - **[${a.amount}] | [${a.balance}]**`);
        const chunk = this.client.util.chunk(map, 15);

        const embed = new EmbedBuilder()
            .setColor(`Aqua`)
            .setTitle('Pemasukan & Pengeluaran Kas')
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ forceStatic: true, size: 4096 }) })
            .setDescription(chunk[pagination - 1].join('\n'))
            .setFooter({ text: `Page ${pagination} of ${chunk.length}` });

        const btn = [
            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel('< Back').setCustomId(`back-${message.id}`),
            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel('Next >').setCustomId(`next-${message.id}`)
        ];

        const r = await message.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(btn)] });
        const collector = r.channel.createMessageComponentCollector({ filter: msg => msg.user.id === message.author.id, time: 60_000 });
        collector.on('collect', async msg => {
            await msg.deferUpdate();

            switch (msg.customId) {
                case `back-${message.id}`:
                    if (pagination === 1) return;
                    pagination--;
                    embed.setDescription(chunk[pagination - 1].join('\n'));
                    embed.setFooter({ text: `Page ${pagination} of ${chunk.length}` })

                    r.edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents(btn)] });
                    break;

                case `next-${message.id}`:
                    if (pagination === chunk.length) return;
                    pagination++;
                    embed.setDescription(chunk[pagination - 1].join('\n'));
                    embed.setFooter({ text: `Page ${pagination} of ${chunk.length}` })

                    r.edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents(btn)] });
                    break;
            }
        });
    }

    /**
     * Pilih Opsi
     * @param {Message} message 
     * Structure Discord Message
     * @param {Array} args 
     * Array Message Content
     */
    getCommand(message, args, query) {
        switch (query) {
            case 'saldo':
                this.cekSaldo(message);
                break;

            case 'data':
                this.cekDonatur(message, args);
                break;

            case 'status':
                this.cekStatusDonasi(message, args);
                break;

            case 'apply':
                this.applyDonatur(message, args);
                break;

            case 'history':
                this.cekHistoryKas(message, args);
                break;

            default:
                message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Random')
                            .setTitle('List Opsi Trakteer')
                            .addFields(
                                { name: 'saldo', value: 'ngecek saldo' },
                                { name: 'status | status --all', value: 'lihat durasi role donatur' },
                                { name: 'data', value: 'lihat data donatur dari awal hingga sekarang' },
                                { name: 'apply', value: 'memberikan role kepada donatur yang tidak terpasang secara otomatis' },
                                { name: 'history', value: 'lihat history kas' }
                            )
                    ]
                });
                break;
        }
    }
}


module.exports = Donatur;