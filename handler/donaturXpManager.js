const dbXp = require('../database/schema/xp_player');
const dbDonatur = require('../database/schema/Donatur');
const dbBooster = require('../database/schema/Booster');
const Discord = require('discord.js');
const moment = require('moment');
moment.locale('id');

module.exports = async (client) => {
    const getXP = await dbXp.findOne({ id: 1 });
    const getUser = await dbDonatur.find({});
    const getBooster = await client.guilds.cache.get('336336077755252738').members.cache.filter(member => member.roles.cache.has('589047055360589824'));

    if (!getXP && getUser.length < 1 || !getXP || getUser.length < 1) return console.log('Data player tidak ada!');

    // if time 12 pm or 24
    const time = moment().format('HH:mm');
    if (time === '24:00') {
        const temp = [];
        for (let user of getUser) {
            await dbDonatur.findOneAndUpdate({ userID: user.userID }, { message: { daily: 0, base: user.message.base } });
            console.log(`${user.userID} secara otomatis reset daily message`);
            temp.push(user);
        }
        client.channels.cache.get('894853662629834772').send({
            embeds: [
                new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Daily Message Reset - Donatur')
                    .setDescription(temp.map(user => `${user.userID} - [${user.message.daily}]`).join('\n'))
                    .setFooter('Daily Message Reset')
                    .setTimestamp()
            ]
        })

        // boostermessage
        const temp2 = [];
        for (let user of getBooster) {
            await dbBooster.findOneAndUpdate({ userID: user.id }, { message: { daily: 0, base: user.message.base } });
            console.log(`${user.id} secara otomatis reset daily message`);
            temp2.push(user);
        }
        client.channels.cache.get('894853662629834772').send({
            embeds: [
                new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Daily Message Reset - Booster')
                    .setDescription(temp2.map(user => `${user.id} - [${user.message.daily}]`).join('\n'))
                    .setFooter('Daily Message Reset')
                    .setTimestamp()
            ]
        });
    }

    for (let member of Array.from(getBooster)) {
        const findXP = getXP.data.find(a => a.id === member[0]);
        if (!findXP) continue;

        const getUserBoost = await dbBooster.findOne({ userID: member[0] });
        if (!getUserBoost) {
            member = await dbBooster.create({
                userID: findXP.id,
                message: {
                    daily: 0,
                    base: findXP.message_count
                }
            });
        } else {
            member = getUserBoost;
        };

        const totalXP = findXP.message_count - member.message.base;
        await dbBooster.findOneAndUpdate({ userID: member.userID }, { message: { daily: totalXP, base: member.message.base } });
        console.log(`${member.userID} - ${totalXP} - Booster`);
    }

    for (let user of getUser) {
        const findXP = getXP.data.find(a => a.id === user.userID);
        if (!findXP) continue;

        const totalXP = findXP.message_count - user.message.base;
        user = await dbDonatur.findOneAndUpdate({ userID: user.userID }, { message: { daily: totalXP, base: user.message.base } });
        console.log(`${user.userID} - [${user.message.daily}] - Donatur`);
    }

}