const Discord = require('discord.js');

module.exports = client => {
  console.log('Tersambung.');
  client.user.setStatus('idle');

  // setInterval(require('../handler/XP'), 300000);
  // setInterval((c = client) => require('../handler/dailyXP')(c), 60000);
  // setInterval((c = client) => require('../handler/resetDaily')(c), 60000)

}

