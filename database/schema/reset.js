const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
    guildID: String,
    isReset: Boolean
});

const eventData = model('RESET_DAILY', eventSchema);

module.exports = eventData;