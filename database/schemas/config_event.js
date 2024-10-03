const { model, Schema } = require("mongoose");

const schemaConfig = new Schema({
  id: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  messageCount: {
    default: 0,
    type: Number,
  },
  interval: {
    default: 30_000,
    type: Number,
  },
  channel: String,
});

module.exports = model("configEvent", schemaConfig);
