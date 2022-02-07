const dbXp = require('../database/schema/xp_player');
const dbDonatur = require('../database/schema/Donatur');
const dbBooster = require('../database/schema/Booster');
const Discord = require('discord.js');
const moment = require('moment');
moment.locale('id');

module.exports = async (client) => {
    try {
        const guild = client.guilds.cache.get('932997958738268251');
        const getXP = await dbXp.findOne({ id: 1 });
        const getUserdb = await dbDonatur.find({});
        const getUser = await guild.members.cache.filter(member => member.roles.cache.has('932997958788608044'));
        const getBoosterdb = await dbBooster.find({});
        const getBooster = await guild.members.cache.filter(member => member.roles.cache.has('933117751264964609'));

        if (!getXP && getUser.length < 1 || !getXP || getUser.length < 1) return console.log('Data player tidak ada!');

        // if time 12 pm or 24
        const time = moment().format('HH:mm');
        if (time === '24:00' || time === '00:00') {

            const temp = [];
            for (let user of getUserdb) {
                const findXP = getXP.data.find(a => a.id === user.userID);
                if (!findXP) continue;

                await dbDonatur.findOneAndUpdate({ userID: user.userID }, { message: { daily: 0, base: findXP.message_count, isCompleted: false }, isAttend: false });
                console.log(`${user.userID} secara otomatis reset daily message`);
                temp.push(user);
            }

            const map = temp.map(async a => {
                const member = await guild.members.fetch(a.userID);
                const xp = (a.message.daily * 10) * 0.25;

                return `**${member.user.tag} [${member.id}]** - \`${xp}\` XP`;
            });

            client.channels.cache.get('932997960923480101').send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Daily Message Reset - Donatur')
                        .setDescription(`${await Promise.all(map).then(a => a.join('\n'))}`)
                        .setFooter('Daily Message Reset')
                        .setTimestamp()
                ]
            });

            // boostermessage
            const temp2 = [];
            for (let user of getBoosterdb) {
                const findXP = getXP.data.find(a => a.id === user.userID);
                if (!findXP) continue;

                // if booster expired, then delete it
                const isExpired = getBooster.find(member => member.id === user.userID);
                if (!isExpired) {
                    await dbBooster.findOneAndDelete({ userID: user.userID });

                    temp2.push(user);
                    continue;
                }

                await dbBooster.findOneAndUpdate({ userID: user.userID }, { message: { daily: 0, base: findXP.message_count }, isAttend: false });
                console.log(`${user.userID} secara otomatis reset daily message`);
                temp2.push(user);
            }

            const map2 = temp2.map(async a => {
                const member = await guild.members.fetch(a.userID);
                const xp = (a.message.daily * 10) * 0.25;

                return `**${member.user.tag} [${member.id}]** - \`${xp}\` XP`;
            });

            client.channels.cache.get('932997960923480101').send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Daily Message Reset - Booster')
                        .setDescription(`${await Promise.all(map2).then(a => a.join('\n'))}`)
                        .setFooter('Daily Message Reset')
                        .setTimestamp()
                ]
            });

            return 0;
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

            member.message.base = member.message.base ? member.message.base : findXP.message_count;
            const totalXP = findXP.message_count - member.message.base;

            await dbBooster.findOneAndUpdate({ userID: member.userID }, { message: { daily: isNaN(totalXP) ? 0 : totalXP, base: member.message.base } });
            console.log(`${member.userID} - ${totalXP} - Booster`);
        }

        for (let user of getUserdb) {
            const findXP = getXP.data.find(a => a.id === user.userID);
            if (!findXP) continue;

            user.message.base = user.message.base ? user.message.base : findXP.message_count;
            const totalXP = findXP.message_count - user.message.base;

            user = await dbDonatur.findOneAndUpdate({ userID: user.userID }, { message: { daily: isNaN(totalXP) ? 0 : totalXP, base: user.message.base } });
            console.log(`${user.userID} - [${user.message.daily}] - Donatur`);
        }
    } catch (e) {
        console.log(e);
        client.channels.cache.get('932997960923480099').send(`[Error Donatur XP Manager] ${e.message}`);
    }
}