const { Schema, model } = require('mongoose');

const XPSchema = new Schema({
    id: Number,
    data: Array
});

const XP = model('XP_PLAYER', XPSchema);

module.exports = XP;