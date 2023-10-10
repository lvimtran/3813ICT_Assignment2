const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    type: {  // to distinguish between text and image messages
        type: String,
        enum: ['text', 'image'],
        default: 'text'
    },
    imageUrl: { // only applicable if type is 'image'
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
