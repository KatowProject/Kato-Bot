const { model, Schema } = require('mongoose');

const schemaUser = new Schema({
    userID: String,
    ticket: Number,
    isAttend: Boolean,
    messageCount: Number,
    messageBase: Number,
    isComplete: Boolean,
    alreadyPurchase: Array
});

const schemaShop = new Schema({
    id: String,
    name: String,
    price: Number,
    stock: Number,
});

const schemaConfig = new Schema({
    isOpen: Boolean,
    messageCount: Number,
    interval: Number,
});



module.exports = {
    User: model('userEvent', schemaUser),
    Shop: model('shopEvent', schemaShop),
};