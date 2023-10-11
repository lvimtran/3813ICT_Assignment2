// /chatAppBackend/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('../models/user');

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    console.log(req.body)
  
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
  
      res.status(201).json({message: 'Registration successful'});
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });



router.post('/login',
  [
      check('username', 'Username is required').notEmpty(),
      check('password', 'Password is required').notEmpty()
  ],
  async (req, res) => {
      console.log('Login payload:', req.body); // Log incoming payload

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          console.error('Validation errors:', errors.array()); // Log validation errors
          return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            const payload = {
                user: {
                    id: user.id,
                    roles: user.roles
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: 3600 }, // Token expiration time in seconds
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error('Server error:', err.message); // Log server errors
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
