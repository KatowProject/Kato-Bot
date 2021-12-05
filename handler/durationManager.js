const donate = require('../database/schema/Donatur');
const mutee = require('../database/schema/MuteMembers');

module.exports = async (client) => {
    const donaturs = await donate.find({});
    const mutes = await mutee.find({});

    for (const donatur of donaturs) {
        const timeLatest = Date.now() - donatur.now;
        if (timeLatest > donatur.duration) {
            const guild = client.guilds.cache.get(donatur.guild);
            const member = guild.members.cache.get(donatur.userID);
            if (!member) return donate.findOneAndDelete({ userID: donatur.userID });

            await member.roles.remove('438335830726017025');
            await donate.findOneAndDelete({ userID: donatur.userID });
            client.channels.cache.find(a => a.name === 'staff-bot').send({ content: 'true - Donatur' });
            member.send('Hai durasi role Donatur mu dilepas oleh kato, terima kasih atas dukungannya!');
        };
    };

    for (const member of mutes) {
        const timeLatest = Date.now() - member.now;
        if (timeLatest > member.duration) {
            await client.guilds.cache.get(member.guild).members.cache.get(member.userID).roles.remove('430378151651049486');
            await mutee.findOneAndDelete({ userID: member.userID });
            client.channels.cache.find(a => a.name === 'staff-bot').send({ content: 'true - Mute' });
        };
    };
};