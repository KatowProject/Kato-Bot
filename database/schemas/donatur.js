const { Schema, model, models } = require("mongoose");

const DonaturSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },
  guildID: {
    type: String,
    required: true,
  },
  time: {
    duration: {
      type: Number,
      required: true,
      default: 0,
    },
    now: {
      type: Number,
      default: Date.now(),
    },
  },
  message: {
    daily: {
      type: Number,
      default: 0,
    },
    base: {
      type: Number,
      default: 0,
    },
  },
  isBooster: {
    type: Boolean,
    default: false,
  },
});

module.exports = models.DONATUR || model("DONATUR", DonaturSchema);
