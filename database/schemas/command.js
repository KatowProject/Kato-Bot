const { Schema, model, models } = require("mongoose");

const commandSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  channels: {
    type: [String],
    required: true,
  },
});

const specificCmdSchema = new Schema({
  guild: {
    type: String,
    required: true,
  },
  commands: {
    type: [commandSchema],
    required: true,
  },
});

module.exports =
  models.SPECIFIC_COMMANDS || model("SPECIFIC_COMMANDS", specificCmdSchema);
