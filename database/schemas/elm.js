const { Schema, model, models } = require("mongoose");

const ELM = new Schema({
  userID: {
    type: String,
    required: true,
  },
  guild: {
    type: String,
    required: true,
  },
  roles: {
    type: Array,
    default: [],
    required: true,
  },
});

module.exports = models.ELMs || model("ELMs", ELM);
