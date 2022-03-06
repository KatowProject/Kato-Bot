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
      const channel = client.channels.cache.get(data.message.channelID);
      const timeLeft = Date.now() - data.time.now;

      if (timeLeft > data.time.duration) {
        if (data.isDone) continue;

        const winLength = data.winner;
        const win = client.util.shuffle(data.entries);
        const winners = win.slice(0, winLength);

        data.isDone = true;
        data.embed.fields[2] = { name: 'Winners:', value: winners.map(a => `<@${a}>`).join(', '), inline: false };

        const msg = await channel.messages.fetch(data.message.id);
        msg.edit('🎉- Giveaway Ended -🎉', { embed: data.embed });
        client.channels.cache.get(data.message.channelID).send(`Congrats ${winners.map(a => `<@${a}>`).join(', ')}!\n${msg.url}`);

        db.set(allGiveaway[i].ID, data);
      }
    }
  }, 10000);
}

