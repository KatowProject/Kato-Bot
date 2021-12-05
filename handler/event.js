const { readdirSync } = require("fs");

module.exports = client => {
    const events = readdirSync("./events/");
    for (let event of events) {
        let file = require(`../events/${event}`);

        const musicPlayerEvents = [
            "botDisconnect.js",
            "channelEmpty.js",
            "connectionCreate.js",
            "connectionError.js",
            "debug.js",
            "error.js",
            "queueEnd.js",
            "trackAdd.js",
            "trackEnd.js",
            "tracksAdd.js",
            "trackStart.js"
        ]
        if (musicPlayerEvents.includes(event)) {
            client.player.on(event.split('.')[0], (...args) => file(client, ...args));

            continue;
        };

        client.on(event.split(".")[0], (...args) => file(client, ...args));
    }
};