const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const cors = require('cors');

const User = require('../models/user');
const Message = require('../models/message');

const { createUser, getUser, updateUser, deleteUser } = require('../controllers/userController');

app.use(cors())

router.post('/', createUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

router.get('/messages/:channelId', async (req, res) => {
  try {
    const messages = await Message.find({ channelId: req.params.channelId });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate the input (optional, if not validated on the client-side)
    if(!username || !password || password.length < 6) {
      return res.status(400).send('Invalid input');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send('User exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword
    });
    await newUser.save();
    
    res.send('User registered');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
