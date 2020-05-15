module.exports = client => {
  console.log('Tersambung.');
  client.user.setStatus('online');
  
  function randomStatus() {
    let userTotal = client.guilds.cache.get("336336077755252738").members.cache.size.toLocaleString();
    let status = ["discord.gg/pos", "discord.gg/W8zpEfU", "discord.me/posantai", `${userTotal} users in POS`, "anjay mabar"];
    let rstatus = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[rstatus], {type: 'WATCHING'});

  }; setInterval(randomStatus, 60000);
}