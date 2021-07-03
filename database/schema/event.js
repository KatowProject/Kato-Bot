const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
    userID: String,
    data: String
});

const eventData = model('EVENT_DATA', eventSchema);

module.exports = eventData;