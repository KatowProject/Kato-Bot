const Discord = require('discord.js');
const moment = require('moment-timezone');
const { User } = require('../../database/schema/TempEvent.js');
const Shop = require('./tempShop.js');
const Xp = require('../../database/schema/xp_player.js');

moment.tz.setDefault('Asia/Jakarta');

class TempEvent {
    constructor(obj) {
        this.client = obj.client;
        this.interval = obj.interval;
        this.messageCount = obj.messageCount;
        this.isOpen = obj.isOpen;
        this.channel = obj.channel;
        this.Shop = new Shop(obj);
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
                        const ticket = user.ticket;
                        user.ticket = ticket + 1;
                        user.isComplete = true;

                        const user = this.client.users.cache.get(user.userID);
                        if (user) user.send({ content: 'Selamat kamu telah menyelesaikan event harian.' });
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

    init() {
        try {
            if (!this.interval) throw new Error('Interval is not defined');
            if (!this.channel) throw new Error('Channel is not defined');
            if (!this.client) throw new Error('Client is not defined');
            if (!this.messageCount) throw new Error('Message count is not defined');

            this.messageCheck();
            setInterval(() => {
                this.messageCheck();
            }, this.interval);
        } catch (err) {
            this.client.channels.cache.get(this.channel).send({ content: 'Error: ' + err.message ?? err ?? 'Unknown error' });
        }
    }
}

module.exports = TempEvent;