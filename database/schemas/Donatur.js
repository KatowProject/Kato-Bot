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
    ticket: {
        default: 0,
        type: Number
    },
    isAttend: {
        default: false,
        type: Boolean
    },
    isBooster: {
        default: false,
        type: Boolean
    }
});

module.exports = models.DONATUR || model('DONATUR', donaturSchema);