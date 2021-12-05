const Discord = require('discord.js');

module.exports = (client) => {
    console.log('I\'m Ready');

    /* Reset Collection Attachment */
    setInterval(() => client.cacheAttachments = new Discord.Collection(), 300000);

    /* Duration Manager [donatur, mute] */
    setInterval(() => require('../handler/durationManager')(client), 30000);

    /* Notifications */
    client.trakteer.getNotification(true, 30000);

    /** Giveaway Check */
    setInterval(() => require('.././module/Giveaway/handler')(client), 15000);
}