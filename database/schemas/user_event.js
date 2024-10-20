const { model, Schema } = require("mongoose");

const schemaUser = new Schema({
  userID: {
    type: String,
    required: true,
  },
  ticket: {
    type: Number,
    default: 0,
  },
  isAttend: {
    type: Boolean,
    default: false,
  },
  messageCount: {
    type: Number,
    default: 0,
  },
  messageBase: {
    type: Number,
    default: 0,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  alreadyPurchase: {
    type: Array,
    default: [],
  },
});

module.exports = model("userEvent", schemaUser);
