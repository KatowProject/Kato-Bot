const db = require('../database/schema/xp_player');
const axios = require('axios');

module.exports = async () => {
    let i = 0;
    let isTrue = true;
    const temp = [];

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
    console.log('sudah selesai semua');
}