const Discord = require('discord.js');
const db = require('../database').ga;

module.exports = client => {
  console.log('Tersambung.');
  client.user.setStatus('idle');

  /* Reset Collection Attachment */
  setInterval(() => client.dataAttachment = new Discord.Collection(), 300000);

  /* Giveaway Time */
  setInterval(async () => {
    const allGiveaway = db.all();
    for (let i = 0; i < allGiveaway.length; i++) {
      const data = db.get(allGiveaway[i].ID);
      const channel = client.channels.cache.get(data.channelID);
      if (!channel) continue;
      const timeLeft = Date.now() - data.time.start;

      if (timeLeft > data.time.duration) {
        if (data.isDone) continue;

        const msg = await channel.messages.fetch(data.messageID);
        if (data.entries.length === 0) {
          data.isDone = true;
          data.embed.fields[3] = { name: 'Pemenang:', value: 'Tidak ada yang menang', inline: false };

          msg.edit({ content: '**🎉- Giveaway Ended -🎉**', embeds: [data.embed] });
          db.set(data.messageID, data);

          return client.channels.cache.get(data.channelID).send(`Tidak ada yang menang karna nol partisipan!`);
        };

        const winLength = data.winnerCount;
        const win = client.util.shuffle(data.entries);
        const winners = win.slice(0, winLength);

        data.isDone = true;
        data.embed.fields[3] = { name: 'Winners:', value: winners.map(a => `<@${a}>`).join(', '), inline: false };

        msg.edit({ content: '**🎉- Giveaway Ended -🎉**', embeds: [data.embed] });
        client.channels.cache.get(data.channelID).send({ content: `Congrats ${winners.map(a => `<@${a}>`).join(', ')}!\n${msg.url}`, allowedMentions: { parse: ["users"] } });

        db.set(data.messageID, data);
      }
    }
  }, 10000);
}

