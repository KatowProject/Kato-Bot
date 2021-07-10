const dbXp = require('../database/schema/xp_player');
const dbUser = require('../database/schema/event');
const Discord = require('discord.js');

module.exports = async (client) => {
    const getXP = await dbXp.findOne({ id: 1 });
    const getUser = await dbUser.find({});

    if (!getXP && getUser.length < 1 || !getXP || getUser.length < 1) {
        return console.log('Data player tidak ada!');
    }

    for (const user of getUser) {
        const findXP = getXP.data.find(a => a.id === user.userID);
        if (!findXP) continue;

        if (user.message.base === 0) {
            await dbUser.findOneAndUpdate({ userID: findXP.id },
                {
                    message: {
                        daily: 0,
                        base: findXP.message_count,
                        isComplete: false
                    }
                });
        } else {
            if (user.message.isComplete) continue;

            const checkXP = findXP.message_count - user.message.base;
            if (checkXP === findXP.message_count || checkXP < 1) return console.log('Nilainya masih nol!');
            if (checkXP === user.message.daily) continue;
            if (checkXP >= 50) {
                await dbUser.findOneAndUpdate({ userID: findXP.id },
                    {
                        ticket: user.ticket + 1,
                        message: {
                            daily: checkXP,
                            base: user.message.base,
                            isComplete: true
                        }
                    });
                client.users.cache.find(a => a.id === findXP.id).send('Misi telah selesai!');
                continue;
            }

            await dbUser.findOneAndUpdate({ userID: findXP.id }, { message: { daily: checkXP, base: user.message.base, } });
        }

    }

}