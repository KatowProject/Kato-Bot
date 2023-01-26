const db = require('../../database/schemas/Xp');
const axios = require('axios');

module.exports = async (client) => {
    let datas = await db.findOne({ id: 1 });
    if (datas === null || !datas) await db.create({ id: 2, data: [] });

    let i = 0;
    let isTrue = true;
    const temp = [];
    while (isTrue) {
        const response = await axios.get('https://mee6.xyz/api/plugins/levels/leaderboard/932997958738268251?page=' + i);

        const users = response.data.players;
        if (users.length === 0) break;
        for (const user of users) user.message_count >= 1 ? temp.push(user) : isTrue = false;

        i++
    };

    await db.findOneAndUpdate({ id: 1 }, { data: temp });
}