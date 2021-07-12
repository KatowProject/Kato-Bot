const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
    userID: String,
    realName: String,
    songSelection: String
});

module.exports = model('event_participation', eventSchema);