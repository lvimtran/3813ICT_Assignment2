const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true  
    },
}, { timestamps: true });

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    channels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    }]
}, { timestamps: true });

// Export models as necessary
module.exports = {
    Group: mongoose.model('Group', GroupSchema),
    Channel: mongoose.model('Channel', ChannelSchema)
};
