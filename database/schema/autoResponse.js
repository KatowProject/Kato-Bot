const { Schema, model } = require('mongoose');

const AutoresponseSchema = new Schema({
    guild: String,
    data: Array
});

const AR = model('AUTO_RESPOND', AutoresponseSchema);

module.exports = AR;