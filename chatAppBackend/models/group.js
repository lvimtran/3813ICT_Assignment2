const mongoose = require('mongoose');

// If using ChannelSchema, it might look something like this
const ChannelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true  // Ensure there’s a strategy to manage uniqueness across collections, if necessary
    },
    // Additional channel properties here...
}, { timestamps: true });

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
        // 'required' is false by default, so it can be omitted unless needed
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // Add 'required' and other validations as per your requirements
    }],
    channels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    }]
    // Consider adding 'admins' or other relevant properties as per your original schema if necessary
}, { timestamps: true });

// Export models as necessary
module.exports = {
    Group: mongoose.model('Group', GroupSchema),
    Channel: mongoose.model('Channel', ChannelSchema)
};
