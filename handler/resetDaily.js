const Discord = require('discord.js');
const db = require('../database/schema/event');
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

        client.channels.cache.get('861405086823350313').send('Daily telah diulang kembali!');

    } else if (hours == 24 || hours == 00 || hours == 24 && minutes > 0) {

        for (const user of userData) {
            await db.findOneAndUpdate({ userID: user.userID }, { isAttend: false, message: { daily: 0, base: 0, isComplete: false } });
            console.log('Berhasil Berubah!');
        }

        client.channels.cache.get('861405086823350313').send('Daily telah diulang kembali!');
    }

}