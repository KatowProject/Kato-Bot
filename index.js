const Discord = require("discord.js");
const Kato = require("./handler/ClientBuilder.js");
const client = new Kato({ disableEveryone: true, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const recent = new Set();

require("./handler/module.js")(client);
require("./handler/Event.js")(client);


client.package = require("./package.json")
client.on("warn", console.warn);
client.on("error", console.error);
client.on("disconnect", () => console.log("Disconnected."));
client.on("reconnecting", () => console.log("Reconnecting."));

client.login(client.config.token).catch(console.error);

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", reason.stack || reason);
  console.error(reason);
});

process.on("uncaughtException", err => {
  console.error(new Date());
  console.error(`Caught exception: ${err}`);
  console.error(err);
  if (err.code == "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
    console.error("true");
  }
});

//////////Welcomer Log/////////////////////////

client.on('guildMemberAdd', member => {
  if (member.guild.id !== "510846217945743380") return;

  client.channels.cache.get('636553126362742784').send(`Hai ${member}, Selamat datang di Server ${member.guild.name}!`)
  member.roles.add('511177887739543552')
})

client.on('guildMemberRemove', member => {
  if (member.guild.id !== "510846217945743380") return;

  client.channels.cache.get('636553126362742784').send(`${member} telah keluar dari Server!`)
})