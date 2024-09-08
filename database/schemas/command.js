const { Schema, model, models } = require("mongoose");

const specificCmdSchema = new Schema({
  guild: {
    type: String,
    required: true,
  },
  command: {
    channels: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
});

module.exports =
  models.SPECIFIC_COMMANDS || model("SPECIFIC_COMMANDS", specificCmdSchema);
