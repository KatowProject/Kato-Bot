const { Schema, model } = require('mongoose');

const ELM = new Schema({

    userID: String,
    guild: String,
    roles: Array

});

const ELMs = model('ELMs', ELM);

module.exports = ELMs;