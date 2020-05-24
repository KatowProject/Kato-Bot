const Discord = require("discord.js");
const Kato = require("./handler/ClientBuilder.js");
const client = new Kato({ disableEveryone: true, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const recent = new Set();

//Music Bot
const {Player} = require('discord-player')
const player  = new Player(client, client.config.GOOGLE_API_KEY)
client.player = player;
client.emoji  = require('./commands/Music/emoji.json')
client.warna  = require('./commands/Music/colors.json')

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