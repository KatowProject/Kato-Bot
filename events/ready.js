const db = require('../database/schema/Giveaway');

module.exports = client => {
  console.log('Tersambung.');
  client.user.setStatus('idle');

  setInterval((c = client) => require('../handler/dailyXP')(c), 60000);
  setInterval((c = client) => require('../handler/resetDaily')(c), 60000);

  /* Giveaway Time */
  setInterval(async () => {
    const allGiveaway = await db.find({});
    for (let i = 0; i < allGiveaway.length; i++) {
      const data = allGiveaway[i];
      const channel = client.channels.cache.get(data.channelID);
      const timeLeft = Date.now() - data.time.start;

      if (timeLeft > data.time.duration) {
        if (data.isDone) continue;

        const msg = await channel.messages.fetch(data.messageID);
        if (data.entries.length === 0) {
          data.isDone = true;
          data.embed.fields[3] = { name: 'Pemenang:', value: 'Tidak ada yang menang', inline: false };

          msg.edit('**🎉- Giveaway Ended -🎉**', { embed: data.embed });
          await db.findOneAndUpdate({ messageID: data.messageID }, data);

          return client.channels.cache.get(data.channelID).send(`Tidak ada yang menang karna nol partisipan!`);
        };

        const winLength = data.winnerCount;
        const win = client.util.shuffle(data.entries);
        const winners = win.slice(0, winLength);

        data.isDone = true;
        data.embed.fields[3] = { name: 'Winners:', value: winners.map(a => `<@${a}>`).join(', '), inline: false };

        msg.edit('**🎉- Giveaway Ended -🎉**', { embed: data.embed });
        client.channels.cache.get(data.channelID).send(`Congrats ${winners.map(a => `<@${a}>`).join(', ')}!\n${msg.url}`);

        await db.findOneAndUpdate({ messageID: data.messageID }, data);
      }
    }
  }, 10000);
}

