const Discord = require("discord.js");
const Kato = require("./handler/ClientBuilder.js");
const client = new Kato({ disableMentions: 'everyone', partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const recent = new Set();
const logs = require('discord-logs')
logs(client)

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