const express = require('express');
const bcrypt = require('bcryptjs');
// const mongoose= require('mongoose')
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router()

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log('Register Request Body:', req.body);
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    try {
          // Check if user already exists
          const existingUser = await User.findOne({ email });
          if (existingUser) {
              return res.status(400).json({ error: 'User already exists with this email.' });
          }
          const hashedPassword = await bcrypt.hash(password, 10);

const newUser = new User({
    username,
    email,
    password: hashedPassword
      });

        // const newUser = new User({ username, password/*: hashedPassword*/ });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, isSubscribed: user.isSubscribed }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.sendStatus(403); // Forbidden
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user; // Attach user information to the request object
        next();
    });
};

module.exports = authenticateJWT;

module.exports = router;