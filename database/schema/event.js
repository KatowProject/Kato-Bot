const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
    userID: String,
    ticket: Number,
    isAttend: Boolean,
    items: Array
});


module.exports = model('EVENT_DATA', eventSchema);