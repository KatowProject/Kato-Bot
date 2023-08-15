const { Schema, model } = require('mongoose');

const formSchema = new Schema({
    formId: { required: true, type: String, unique: true },
    questionData: {
        title: { required: true, type: String },
        channel: { required: true, type: String },
        formDataChannel: { required: true, type: String },
        questions: { type: Array, required: true, default: [] },
        isOnce: { type: Boolean, required: true, default: false },
    },
    answers: { type: Array, required: true, default: [] },
    isCompleted: { type: Boolean, required: true, default: false },
    isDeleted: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
});

module.exports = model('form', formSchema);