const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
    id: Number,
    data: Array
});

const eventData = model('XP_PLAYER', eventSchema);

module.exports = eventData;