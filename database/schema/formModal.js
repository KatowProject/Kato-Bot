const { model, Schema } = require('mongoose');

const schema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    channel: { type: String, required: true },
    questions: { type: Array, required: true },
    isOnce: { type: Boolean, required: true },
    userAlreadySubmit: { type: Array, required: true },
});