const { Schema, model } = require('mongoose');

const donaturSchema = new Schema({
    userID: String,
    guild: String,
    duration: Number,
    now: Number
});

const donatur = model('DONATUR', donaturSchema);

module.exports = donatur;