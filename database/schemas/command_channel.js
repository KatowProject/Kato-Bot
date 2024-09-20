const { Schema, model, models } = require("mongoose");

const cmdChannelSchema = new Schema({
  guild: {
    type: String,
    required: true,
  },
  channels: {
    type: Array,
    required: true,
  },
});

module.exports = models.ALL_COMMANDS || model("ALL_COMMANDS", cmdChannelSchema);
