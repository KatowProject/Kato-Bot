const Discord = require('discord.js');
const axios = require('axios');
const db = require('../../database/schema/xp_player');

exports.run = async (client, message, args) => {
    let i = 0;
    let isTrue = true;
    const temp = [];

    const alert = await message.reply('Mohon Tunggu sebentar ya!')
    let datas = await db.findOne({ id: 1 });
    if (datas === null || !datas) {
        await db.create({ id: 1, data: [] });
    }

    while (isTrue) {
        const response = await axios.get('https://mee6.xyz/api/plugins/levels/leaderboard/336336077755252738?page=' + i);
        const users = response.data.players;

        for (const user of users) {
            if (user.level >= 15) {
                temp.push(user);
            } else {
                isTrue = false;
            }
        }
        i++
    };

    await db.findOneAndUpdate({ id: 1 }, { data: temp });
    await alert.edit('Data XP telah berhasil diupdate!');
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['MANAGE_MESSAGES']
};

exports.help = {
    name: 'upxp',
    description: 'daily ticket',
    usage: 'daily',
    example: 'daily'
}