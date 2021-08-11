let Discord = require('discord.js');
const db = require('../database/schema/Giveaway');

module.exports = client => {
  console.log('Tersambung.');
  client.user.setStatus('idle');

  /* Status */
  function randomStatus() {
    let userTotal = client.guilds.cache.get("336336077755252738").memberCount;
    let status = [
      "Perkumpulan Orang Santai",
      "type k!help",
      "Kato Megumi (o゜▽゜)o☆",
      `Members : ${userTotal}`
    ];
    let rstatus = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[rstatus], { type: 'PLAYING' });

  }; setInterval(randomStatus, 15000);

  /** Mute Duration */
  const muteDuration = () => require('../plugin/durationMute.js')(client);
  setInterval(muteDuration, 30000);


  const durationDonatur = () => require('../plugin/durationDonatur.js')(client);
  setInterval(durationDonatur, 60000);

  /* Music Events */
  require('../handler/PlayerEvent.js')(client);

  /* Reset Collection Attachment */
  setInterval(() => client.dataAttachment = new Discord.Collection(), 300000);

  /* Trakteer */
  client.trakteer.getNotification(true, 120000);

  /* Giveaway Time */
  setInterval(async () => {
    const allGiveaway = await db.find({});
    for (let i = 0; i < allGiveaway.length; i++) {
      const data = allGiveaway[i];
      const channel = client.channels.cache.get(data.channelID);
      const timeLeft = Date.now() - data.time.start;

      if (timeLeft > data.time.duration) {
        if (data.isDone) continue;

        const winLength = data.winnerCount;
        const win = client.util.shuffle(data.entries);
        const winners = win.slice(0, winLength);

        data.isDone = true;
        data.embed.fields[2] = { name: 'Winners:', value: winners.map(a => `<@${a}>`).join(', '), inline: false };

        const msg = await channel.messages.fetch(data.messageID);
        msg.edit('🎉- Giveaway Ended -🎉', { embed: data.embed });
        client.channels.cache.get(data.channelID).send(`Congrats ${winners.map(a => `<@${a}>`).join(', ')}!\n${msg.url}`);

        await db.findOneAndUpdate({ messageID: data.messageID }, data);
      }
    }
  }, 10000);
}

