module.exports = client => {
  console.log('Tersambung.');
  client.user.setStatus('idle');

  let playing = client.voice.connections.size;

  function randomStatus() {
    let userTotal = client.guilds.cache.get("336336077755252738").memberCount;
    let status = ["Perkumpulan Orang Santai",
      "type k!help",
      "Kato Megumi (o゜▽゜)o☆",
      `Members : ${userTotal}`];
    let rstatus = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[rstatus], { type: 'PLAYING' });

  }; setInterval(randomStatus, 15000);
}