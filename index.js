const { GatewayIntentBits, Partials, Options } = require("discord.js");
const Kato = require("./core/ClientBuilder");

const client = new Kato({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Message,
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.ThreadMember,
  ],
  makeCache: Options.cacheEverything(),
});

client.login();

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection at:", reason.stack || reason);
});

process.on("uncaughtException", (err) => {
  console.error(new Date());
  console.error(`Caught exception: ${err}`);
  console.error(err.stack);
  if (err.code == "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
    console.error("true");
  }
});
