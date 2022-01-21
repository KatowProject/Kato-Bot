const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: String,
    price: Number,
    stock: Number,
});

module.exports = model('shop_data', schema);