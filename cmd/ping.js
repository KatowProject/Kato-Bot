const Discord = require('discord.js');
const { Client, Message, RichEmbed } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports.run = (client, message, args) => {
  let counting = Date.now();
  message.reply('Tunggu Sebentar')
    .then(msg => {
      let diff = (Date.now() - counting).toLocaleString();
      let api = client.ping.toFixed(0);
      msg.edit(`API: ${api} ms. Latency: ${diff} ms.`);
    })
}

module.exports.help = {
  name: "ping"
}