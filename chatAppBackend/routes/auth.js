const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  // Validate username and password
  if (!username || !email || !password || password.length < 6) {
    return res.status(400).send('Invalid input');
  }

  try {
    // Check if the user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).send('User already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance and save it to the database
    user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).send('Registration successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate username and password
    if (!username || !password) {
      return res.status(400).send('Invalid input');
    }

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      'your_jwt_secret', // Replace with your actual secret
      { expiresIn: '1h' } // Token expiration time
    );

    // Send back the token
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
