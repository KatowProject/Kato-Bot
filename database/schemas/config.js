const { Schema, model, models } = require("mongoose");

const configSchema = new Schema({
  guild: {
    type: String,
    required: true,
  },
  config: [
    {
      name: {
        type: String,
        required: true,
      },
      value: {
        type: Schema.Types.Mixed,
        required: true,
      },
    },
  ],
});

module.exports = models.CONFIG || model("CONFIG", configSchema);
