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
    id: {
        type: String,
        required: true,
    },
    isOpen: {
        type: Boolean,
        default: false,
    },
    messageCount: {
        default: 0,
        type: Number,
    },
    interval: {
        default: 30_000,
        type: Number,
    },
    channel: String,
});



module.exports = {
    User: model('userEvent', schemaUser),
    Shop: model('shopEvent', schemaShop),
    Config: model('configEvent', schemaConfig)
};