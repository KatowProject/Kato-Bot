let discord = require('discord.js');

module.exports = client => {
  console.log('Tersambung.');
  client.user.setStatus('idle');

  function randomStatus() {
    let userTotal = client.guilds.cache.get("336336077755252738").memberCount;
    let status = ["Perkumpulan Orang Santai",
      "type k!help",
      "Kato Megumi (o゜▽゜)o☆",
      `Members : ${userTotal}`];
    let rstatus = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[rstatus], { type: 'PLAYING' });

  }; setInterval(randomStatus, 15000);

  function pengingat() {
    require('../plugin/pengingat.js')(client)
  } setInterval(pengingat, 60000)
}