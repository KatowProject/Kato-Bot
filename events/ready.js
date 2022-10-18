const Discord = require('discord.js');

module.exports = (client) => {
    console.log('I\'m Ready');

    /* Reset Collection Attachment */
    setInterval(() => client.cacheAttachments = new Discord.Collection(), 300_000);

    // /* Duration Manager [donatur, mute] */
    setInterval(() => require('../handler/durationManager')(client), 30_000);

    /* Notifications */
    client.trakteer.getNotification(true, 30_000);

    /** Giveaway Check */
    setInterval(() => require('../module/Giveaway/handler')(client), 15_000);

    /** MEE6 - Level Update */
    setInterval(() => require('../module/MEE6-Leaderboard/')(client), 60_000);

    /** Benefit **/
    setInterval(() => require('../handler/donaturXpManager')(client), 60_000);

    /** Temp Event */
    client.tempEvent.init();
}