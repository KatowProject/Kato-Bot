const { Schema, model } = require('mongoose');

const muteMembersSchema = new Schema({
    userID: String,
    guild: String,
    duration: Number,
    now: Number
});

const muteMembers = model('MUTED_MEMBERS', muteMembersSchema);

module.exports = muteMembers;