const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
    messageID: String,
    channelID: String,
    entries: Number,
    tickets: Number,
    time: {
        now: Number,
        duration: Number
    }
});

const eventData = model('GIVEAWAY_DATA', eventSchema);

module.exports = eventData;