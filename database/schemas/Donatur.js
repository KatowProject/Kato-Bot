const { Schema, model, models } = require('mongoose');

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

module.exports = models.DONATUR || model('DONATUR', donaturSchema);