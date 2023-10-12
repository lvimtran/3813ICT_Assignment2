// module.exports = router;
const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// MongoDB connection (replace with your connection string)
mongoose.connect('mongodb://localhost/myChatDB', { useNewUrlParser: true, useUnifiedTopology: true });

// User schema and model
const User = require('../models/user');

const router = express.Router();



router.post('/register', async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password, // assign plain password, middleware will hash
    });
    
    await user.save();
    res.status(201).send({ msg: 'User registered successfully' });
  } catch (error) {
    res.status(500).send({ msg: 'Server Error', error });
  }
});



// Login route
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(400).send({ msg: 'User not found' });
    }

    console.log('Retrieved hash from DB:', user.password); // Log retrieved hash
    
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    console.log('Password valid:', isPasswordValid); // Log comparison result

    if (!isPasswordValid) {
      return res.status(400).send({ msg: 'Password is incorrect' });
    }

    // Generate a token, manage sessions, or however you handle logins
    res.status(200).send({ msg: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ msg: 'Server Error', error });
  }
});

module.exports = router;
