const Discord = require("discord.js");
const Kato = require("./handler/ClientBuilder.js");
const client = new Kato({ disableEveryone: true, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const recent = new Set();

require("./handler/module.js")(client);
require("./handler/Event.js")(client);  

client.on("message", async message =>{
  require('./handler/srcv2/ar.js')(client,message);
  require('./handler/srcv2/NSFW.js')(client,message)
})

client.package = require("./package.json")
client.on("warn", console.warn);
client.on("error", console.error);
client.on("disconnect", () => console.log("Disconnected."));
client.on("reconnecting", () => console.log("Reconnecting."));

const {token} = require('./config.json') //token
client.login(token).catch(console.error);

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