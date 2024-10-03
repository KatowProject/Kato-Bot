const { model, Schema } = require("mongoose");

const schemaUser = new Schema({
  userID: String,
  ticket: Number,
  isAttend: Boolean,
  messageCount: Number,
  messageBase: Number,
  isComplete: Boolean,
  alreadyPurchase: Array,
});

module.exports = model("userEvent", schemaUser);
