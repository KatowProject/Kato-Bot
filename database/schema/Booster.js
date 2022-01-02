const { Schema, model } = require('mongoose');

const donaturSchema = new Schema({
    userID: String,
    message: {
        daily: Number,
        base: Number,
        isCompleted: Boolean
    }
});

const donatur = model('BOOSTER', donaturSchema);

module.exports = donatur;