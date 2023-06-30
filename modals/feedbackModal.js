// Future work - add built in support for Feedback
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    date: {
        type: Date,
        default: Date().now,
        // required: true
    },
    email: { type: String, },
    name: { type: String, },
    message: { type: String, required: true },

},{timestamp:true});

const FeedbackModal = mongoose.model('Feedback', schema);
module.exports = FeedbackModal;