const { Schema, model } = require('mongoose');

const donaturSchema = new Schema({
    userID: String,
    guild: String,
    duration: Number,
    now: Number,
    message: {
        daily: Number,
        base: Number
    },
    ticket: Number,
    isAttend: Boolean
});

const donatur = model('DONATUR', donaturSchema);

module.exports = donatur;