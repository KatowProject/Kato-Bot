const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
    userID: String,
    messageCount: Number,
    baseMSG: Number
});

const eventData = model('DAILY_MSG', eventSchema);

module.exports = eventData;