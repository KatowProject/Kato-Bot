const { Schema, model } = require('mongoose');

const shopSchema = new Schema({
    name: String,
    price: Number,
    stock: Number,
});

module.exports = model('shop_data', shopSchema);