const { Schema, model } = require('mongoose');

const GiveawaySchema = new Schema({
    messageID: {
        type: String,
        required: true,
    },
    guildID: {
        type: String,
        required: true,
    },
    channelID: {
        type: String,
        required: true,
    },
    time: {
        start: {
            type: Number,
            default: Date.now(),
        },
        duration: {
            type: Number,
            required: true,
        },
    },
    require: {
        type: Object,
        required: true,
    },
    winnerCount: {
        type: Number,
        required: true,
    },
    entries: {
        type: Array,
        default: [],
    },
    embed: {
        type: Object,
        required: true,
    },
    isDone: {
        type: Boolean,
        default: false,
    },
});

const Giveaway = model('Giveaway', GiveawaySchema);

module.exports = Giveaway;