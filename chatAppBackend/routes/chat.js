const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// Get chat messages for a specific channel
router.get('/messages', async (req, res) => {
  try {
    // Add a .populate('sender', 'username profileImage') to include sender data
    const messages = await Message.find({ channel: req.params.channelId })
                                  .sort({ createdAt: -1 })
                                  .limit(50)
                                  .populate('sender', 'username profileImage');
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Post a chat message
router.post('/messages', async (req, res) => {
  const { content, sender, channel, type, imageUrl } = req.body;

  if (!content || !sender || !channel || !type) {
    return res.status(400).json({ error: 'All required fields must be provided!' });
  }

  try {
    const newMessage = new Message({
      content,
      sender,
      channel,
      type,
      imageUrl: imageUrl || null // Ensure imageUrl is null if not provided
    });
    await newMessage.save();
    io.to(channel).emit('newMessage', newMessage);
    res.json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


module.exports = router;
