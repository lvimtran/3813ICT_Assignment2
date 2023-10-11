const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true,
        unique: true
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Channel', ChannelSchema);
