const { Schema, model } = require('mongoose');

const allCommandsSchema = new Schema({
    guild: String,
    channels: Array
});

const allCommands = model('ALL_COMMANDS', allCommandsSchema);

const specificCommandsSchema = new Schema({
    guild: String,
    command: Array
});

const specificCommands = model('SPECIFIC_COMMANDS', specificCommandsSchema);

module.exports = { allCommands, specificCommands };