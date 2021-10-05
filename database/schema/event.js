const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
    userID: String,
    ticket: Number,
    isParticipant: Boolean,
    isAttend: Boolean,
    message: Object,
    items: Array
});

const eventData = model('EVENT_DATA', eventSchema);

module.exports = eventData;