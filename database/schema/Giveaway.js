const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
    messageID: String,
    guildID: String,
    channelID: String,
    time: Object,
    require: Object,
    winnerCount: Number,
    entries: Array,
    embed: Object,
    isDone: Boolean,
});

const eventData = model('GIVEAWAY_DATA', eventSchema);

module.exports = eventData;