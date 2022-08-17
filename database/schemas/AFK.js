const { Schema, model, models } = require('mongoose');

const schema = new Schema({
    userID: String,
    data: String
});

module.exports = models.AFKs || model('AFKs', schema);