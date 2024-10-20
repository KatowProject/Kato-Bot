const { model, Schema } = require("mongoose");

const schemaShop = new Schema({
  id: {
    type: String,
    unique: true,
    default: require("uuid").v4,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

module.exports = model("shopEvent", schemaShop);
