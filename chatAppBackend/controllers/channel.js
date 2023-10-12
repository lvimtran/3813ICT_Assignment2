const Channel = require('../models/channel');

// controllers/channel.js
exports.createChannel = async (req, res) => {
  try {
    // validate data
    if (!req.body.name) {
      return res.status(400).json({ error: 'Channel name is required' });
    }

    const newChannel = new Channel(req.body); 
    await newChannel.save();
    res.status(201).json(newChannel);
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
