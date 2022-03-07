const { readdirSync } = require("fs");

module.exports = client => {
  const events = readdirSync("./events/");
  for (let event of events) {
    let file = require(`../events/${event}`);
    client.on(event.split(".")[0], (...args) => file(client, ...args));
  }

  const player = readdirSync("./eventsPlayer");
  for (const event of player) {
    const file = require(`../eventsPlayer/${event}`);
    client.player.on(event.split(".")[0], (...args) => file(client, ...args));
  }
};