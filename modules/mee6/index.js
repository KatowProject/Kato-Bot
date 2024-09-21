const db = require("../../database/schemas/xp");
const axios = require("axios");

module.exports = async (guild = "932997958738268251") => {
  const guildData = await db.findOne({ id: guild });
  if (!guildData) await db.create({ id: guild, data: [] });

  let i = 0;
  let isTrue = true;
  const temp = [];
  while (isTrue) {
    const response = await axios.get(
      `https://mee6.xyz/api/plugins/levels/leaderboard/${guild}?page=${i}`
    );

    const users = response.data.players;
    if (users.length === 0) break;
    for (const user of users)
      user.message_count >= 1 ? temp.push(user) : (isTrue = false);

    i++;
  }

  await db.findOneAndUpdate({ id: guild }, { data: temp });
};
