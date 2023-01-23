const { Schema, model, models } = require('mongoose');

const ELM = new Schema({
    userID: String,
    guild: String,
    roles: Array
});

module.exports = models.ELMs || model('ELMs', ELM);