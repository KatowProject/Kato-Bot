const { Schema, model } = require('mongoose');

const GiveawaySchema = new Schema({
    messageID: String,
    guildID: String,
    channelID: String,
    time: Object,
    require: Object,
    winnerCount: Number,
    entries: Array,
    embed: Object,
    isDone: Boolean,
});

const Giveaway = model('Giveaway', GiveawaySchema);

module.exports = Giveaway;