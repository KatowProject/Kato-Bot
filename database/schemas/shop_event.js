const { model, Schema } = require("mongoose");

const schemaShop = new Schema({
  id: String,
  name: String,
  price: Number,
  stock: Number,
});

module.exports = model("shopEvent", schemaShop);
