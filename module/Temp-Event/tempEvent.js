const Discord = require('discord.js');
const moment = require('moment-timezone');
const { User, Config } = require('../../database/schema/TempEvent.js');
const Shop = require('./tempShop.js');
const Xp = require('../../database/schema/xp_player.js');
moment.tz.setDefault('Asia/Jakarta');

class TempEvent {
    constructor(client) {
        this.client = client;
        this.isOpen = false;
        this.channel = null;
        this.messageCount = null;
        this.interval = null;
    }

    async messageCheck() {
        try {
            const users = await User.find({});
            const xp = await Xp.findOne({ id: 1 });
            if (!users) return;

            const time = moment().format('HH:mm');
            for (const user of users) {
                const xpUser = xp.data.find(a => a.id === user.userID)?.message_count;
                if (!xpUser) continue;

                if (time === '24:00' || time === '00:00') {
                    user.messageCount = 0;
                    user.isAttend = false;
                    user.messageBase = xpUser;
                    user.isComplete = false;
                } else {
                    const messageCount = user.messageCount;
                    if (messageCount >= this.messageCount && !user.isComplete) {
                        user.ticket = user.ticket + 1;
                        user.isComplete = true;
                        const _user = this.client.users.cache.get(user.userID);
                        if (_user) _user.send({ content: 'Selamat kamu telah menyelesaikan event harian.' });
                    }
                    else if (messageCount < this.messageCount && user.isComplete) {
                        user.isComplete = false;
                        user.messageCount = xpUser - user.messageBase;

                        const _user = this.client.users.cache.get(user.userID);
                        if (_user) _user.send({ content: 'Telah terjadi perubahan pada event harian, kamu harus mengulang event harian.' });
                    } else {
                        user.messageCount = xpUser - user.messageBase;
                    }
                }
                await user.save();
            }

            if (time === '24:00' || time === '00:00') {
                this.client.channels.cache.get(this.channel).send({ content: 'Daily telah direset.' });

                await new Promise(resolve => setTimeout(resolve, 60_000));
            }
        } catch (err) {
            console.log(err);
            this.client.channels.cache.get(this.channel).send({ content: 'Error: ' + err.message });
        }
    }

    async register(message) {
        try {
            if (!message) throw new Error('Message is not defined');
            const userID = message.author.id;
            const user = await User.findOne({ userID });
            const xp = await Xp.findOne({ id: 1 });

            if (!user) {
                const xpUser = xp.data.find(a => a.id === userID);
                if (!xpUser) return message.reply({ content: 'User tidak ditemukan.' });

                const newUser = new User({
                    userID: userID,
                    messageCount: 0,
                    messageBase: xpUser.message_count,
                    isAttend: false,
                    isComplete: false,
                    ticket: 0,
                });

                await newUser.save();

                return message.reply({ content: 'User berhasil didaftarkan.' });
            } else {
                return message.reply({ content: 'User sudah terdaftar.' });
            }
        } catch (err) {
            return message.channel.send({ content: 'Error: ' + err.message ?? err ?? 'Unknown error' });
        }
    }

    async daily(message) {
        try {
            if (!message) throw new Error('Message is not defined');
            if (!this.isOpen) return message.reply({ content: 'Event belum dibuka atau sudah tidak berlaku.' });

            const userID = message.author.id;
            const user = await User.findOne({ userID });
            if (!user) return message.reply({ content: 'User belum terdaftar.' });

            if (user.isAttend) return message.reply({ content: 'Kamu telah mengambil daily.' });

            const ticket = user.ticket;
            user.ticket = ticket + 1;
            user.isAttend = true;

            await user.save();

            return message.reply({ content: 'Kamu berhasil mengambil daily.' });
        } catch (err) {
            return message.channel.send({ content: 'Error: ' + err.message ?? err ?? 'Unknown error' });
        }
    }

    async inventory(message) {
        try {
            if (!message) throw new Error('Message is not defined');
            const userID = message.author.id;
            const user = await User.findOne({ userID });
            if (!user) return message.reply({ content: 'User belum terdaftar.' });

            const ticket = user.ticket;
            const embed = new Discord.MessageEmbed()
                .setTitle('Inventory')
                .setDescription(`**Ticket:** ${ticket}\n**Daily Message:** ${user.messageCount}/${this.messageCount} (${user.isComplete ? 'Selesai' : 'Belum'})`)
                .setColor('RANDOM')
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                .setFooter({ text: `${message.author.tag} • Reset Daily ${moment().endOf('day').fromNow()}`, iconURL: message.author.displayAvatarURL() });

            return message.reply({ embeds: [embed] });
        } catch (err) {
            return message.channel.send({ content: 'Error: ' + err.message ?? err ?? 'Unknown error' });
        }
    }

    async Config(message, args) {
        try {
            if (!message.member.permissions.has('MANAGE_GUILD')) return message.channel.send({ content: 'Kamu tidak memiliki izin untuk menggunakan command ini.' });

            let config = await Config.findOne({ id: message.guild.id });
            if (!config) config = await Config.create({ id: message.guild.id });

            const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Event Configuration')
                .setDescription('Silahkan pilih opsi dibawah ini untuk mengubah konfigurasi event.')
                .addFields(
                    { name: 'Open', value: `\`${config.isOpen ? '✅' : '❌'}\``, inline: true },
                    { name: 'Message Count', value: `\`${config.messageCount}\``, inline: true },
                    { name: 'Channel Log', value: `${config.channel ? `<#${config.channel}>` : '\`Tidak ada\`'}`, inline: true },
                )

            const btn = new Discord.MessageActionRow()
            const buttons = [
                config.isOpen ?
                    new Discord.MessageButton()
                        .setCustomId('eventconfig:open')
                        .setLabel('Close')
                        .setStyle('DANGER')
                    :
                    new Discord.MessageButton()
                        .setCustomId('eventconfig:open')
                        .setLabel('Open')
                        .setStyle('SUCCESS'),
                new Discord.MessageButton()
                    .setCustomId('messageCount')
                    .setLabel('Message Count')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('channel')
                    .setLabel('Channel Log')
                    .setStyle('PRIMARY'),
            ];

            const msg = await message.channel.send({ embeds: [embed], components: [btn.addComponents(buttons)] });
            const filter = i => i.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 60_000 });
            collector.on('collect', async i => {
                await i.deferUpdate();
                if (i.customId === 'eventconfig:open') {
                    config.isOpen = !config.isOpen;
                    this.isOpen = config.isOpen;
                    await config.save();

                    btn.components[0].style = config.isOpen ? 'SUCCESS' : 'DANGER';
                    btn.components[0].label = config.isOpen ? 'Open' : 'Close';
                    embed.fields[0].value = `\`${config.isOpen ? '✅' : '❌'}\``;

                    msg.edit({ embeds: [embed], components: [btn] });

                    return i.followUp({ content: `Event berhasil di${config.isOpen ? 'buka' : 'tutup'}.`, }).then(m => setTimeout(() => m.delete(), 5_000));
                } else if (i.customId === 'messageCount') {
                    const msg = await message.channel.send({ content: 'Silahkan masukkan jumlah pesan yang dibutuhkan untuk mendapatkan tiket.' });
                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({ filter, time: 60_000, max: 1 });
                    collector.on('collect', async m => {
                        const count = Number(m.content);
                        if (!count) return message.channel.send({ content: 'Harap masukkan angka, silahkan tekan tombol kembali' });

                        config.messageCount = count;
                        this.messageCount = count;
                        await config.save();

                        embed.fields[1].value = `\`${config.messageCount}\``;
                        msg.edit({ embeds: [embed], components: [btn] });

                        i.followUp({ content: `Jumlah pesan berhasil diubah menjadi ${config.messageCount}.`, }).then(m => setTimeout(() => m.delete(), 5_000));
                    });
                } else if (i.customId === 'channel') {
                    const msg = await message.channel.send({ content: 'Silahkan mention channel yang akan digunakan untuk log event.' });
                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({ filter, time: 60_000 });
                    collector.on('collect', async m => {
                        const channel = m.mentions.channels.first();
                        if (!channel) return message.channel.send({ content: 'Harap mention channel.' });

                        config.channel = channel.id;
                        await config.save();

                        embed.fields[2].value = `${config.channel ? `<#${config.channel}>` : '\`Tidak ada\`'}`;
                        msg.edit({ embeds: [embed], components: [btn] });

                        i.followUp({ content: `Channel log berhasil diubah menjadi <#${config.channel}>.`, }).then(m => setTimeout(() => m.delete(), 5_000));
                    });
                }
            });
        } catch (err) {
            return message.channel.send({ content: 'Error: ' + err.message ?? err ?? 'Unknown error' });
        }
    }

    async init() {
        try {
            const conf = await Config.findOne({});
            if (conf) {
                this.isOpen = conf.isOpen;
                this.messageCount = conf.messageCount;
                this.channel = conf.channel;
                this.interval = conf.interval;
                this.Shop = new Shop(this);
            }

            this.messageCheck();
            setInterval(() => {
                this.messageCheck();
            }, this.interval);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = TempEvent;