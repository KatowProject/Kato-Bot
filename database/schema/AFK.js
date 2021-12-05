const { Schema, model } = require('mongoose');

const afkSchema = new Schema({
    userID: String,
    data: String
});

const AFK = model('AFKs', afkSchema);

module.exports = AFK;