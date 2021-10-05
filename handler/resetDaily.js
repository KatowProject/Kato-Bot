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

    if (isCommand) {
        for (const user of userData) {
            await db.findOneAndUpdate({ userID: user.userID }, { isAttend: false, message: { daily: 0, base: 0, isComplete: false } });
            console.log('Berhasil Berubah!');
        }

        client.channels.cache.get('840073578963795999').send('Daily telah diulang kembali!');
    }

    if (hours == 00 && minutes == 00) {
        for (const user of userData) {
            await db.findOneAndUpdate({ userID: user.userID }, { isAttend: false, message: { daily: 0, base: 0, isComplete: false } });
            console.log('Berhasil Berubah!');
        }

        client.channels.cache.get('840073578963795999').send('Daily telah diulang kembali!');
    }
}