const Discord = require('discord.js');
const db = require('../database/schema/event');
const db2 = require('../database/schema/reset');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta');

module.exports = async (client, isCommand = false) => {
    const userData = await db.find({});
    if (userData.length < 1) return;

    const time = moment(new Date()).format('HH:mm');
    const splitTime = time.split(':');

    const hours = splitTime[0];
    const minutes = splitTime[1];

    const getStatus = await db2.findOne({ guildID: '336336077755252738' });
    if (!getStatus) {
        await db2.create({ guildID: '336336077755252738', isReset: false });
    };

    if (isCommand) {

        for (const user of userData) {
            await db.findOneAndUpdate({ userID: user.userID }, { isAttend: false, message: { daily: 0, base: 0, isComplete: false } });
            console.log('Berhasil Berubah!');
        }

        client.channels.cache.get('861405086823350313').send('Daily telah diulang kembali!');

    } else if (hours == 24 && minutes > 0 && !getStatus.isReset || hours == 00 && minutes <= 0 && !getStatus.isReset) {

        const getStatus = await db2.findOne({ guildID: '336336077755252738' });
        if (!getStatus) return;
        if (getStatus.isReset) return;

        for (const user of userData) {
            await db.findOneAndUpdate({ userID: user.userID }, { isAttend: false, message: { daily: 0, base: 0, isComplete: false } });
            console.log('Berhasil Berubah!');
        }

        client.channels.cache.get('861405086823350313').send('Daily telah diulang kembali!');
        await db2.findOneAndUpdate({ guildID: '336336077755252738' }, { isAttend: false });
    }

}