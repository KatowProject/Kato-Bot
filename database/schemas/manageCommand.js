const { Schema, model, models } = require('mongoose');

const allCmdSchema = new Schema({
    guild: String,
    channels: Array
});

const specificCmdSchema = new Schema({
    guild: String,
    command: Array
});

module.exports = {
    allCommands: models.ALL_COMMANDS || model('ALL_COMMANDS', allCmdSchema),
    specificCommands: models.SPECIFIC_COMMANDS || model('SPECIFIC_COMMANDS', specificCmdSchema)
}