const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// Get chat messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Post a chat message
router.post('/messages', async (req, res) => {
  const { user, content } = req.body;
  
  try {
    const newMessage = new Message({
      user,
      content
    });
    await newMessage.save();
    res.json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
