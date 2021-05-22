const Discord = require("discord.js");
const Kato = require("./handler/ClientBuilder.js");
const client = new Kato({ disableMentions: 'everyone', fetchAllMembers: true, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const recent = new Set();

require('discord-logs')(client);
require("./handler/module.js")(client);
require("./handler/Event.js")(client);
require('./database/index')(client.config.discord.db);


client.package = require("./package.json");
client
  .on("warn", console.warn)
  .on("error", console.error)
  .on("disconnect", () => console.log("Disconnected."))
  .on("reconnecting", () => console.log("Reconnecting."));

client.login(client.config.discord.token).catch(console.error);


process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", reason.stack || reason);
});

process.on("uncaughtException", err => {
  console.error(new Date());
  console.error(`Caught exception: ${err}`);
  if (err.code == "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
    console.error("true");
  }
});