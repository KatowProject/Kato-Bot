const donate = require('../database/schema/Donatur');

module.exports = async (client) => {
    const donaturs = await donate.find({});

    for (const donatur of donaturs) {
        const timeLatest = Date.now() - donatur.now;
        if (timeLatest > donatur.duration) {
            const guild = client.guilds.cache.get(donatur.guild);
            const member = guild.members.fetch(donatur.userID);
            if (!member) donatur.remove();

            await member.roles.remove('932997958788608044');
            await donatur.remove();
            client.channels.cache.find(a => a.name === 'staff-bot').send({ content: 'true - Donatur' });
            member.send('Hai durasi role Donatur mu dilepas oleh kato, terima kasih atas dukungannya!');
        };
    };
};