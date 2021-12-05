const { readdirSync } = require("fs");

module.exports = client => {
    const events = readdirSync("./events/");
    for (let event of events) {
        let file = require(`../events/${event}`);

        const musicPlayerEvents = [
            "botDisconnect",
            "channelEmpty",
            "connectionCreate",
            "connectionError",
            "debug",
            "error",
            "queueEnd",
            "trackAdd",
            "trackEnd",
            "tracksAdd",
            "trackStart"
        ]
        if (musicPlayerEvents.includes(event)) {
            client.player.on(event.split('.')[0], (...args) => file(client, ...args));

            continue;
        };

        client.on(event.split(".")[0], (...args) => file(client, ...args));
    }
};