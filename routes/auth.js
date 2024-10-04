const express = require('express');
const bcrypt = require('bcryptjs');
// const mongoose= require('mongoose')
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const bodyParser = require('body-parser');
// const axios = require('axios')
// const cors = require('cors');
//const app = express()
// Replace bodyParser with express methods
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//const crypto = require('crypto');


const router = express.Router()
// app.use(bodyParser.json());

// app.get('/api/auth/register', (req, res) => {
//     res.send('GET request to /api/auth/register');
// });

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
        // const user = await User.findOne({ username });
        // if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, isSubscribed: user.isSubscribed }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

// //Start a payment
// router.post('/initialize-transaction', async (req, res) => {
//     const { email, amount } = req.body;
//     try {
//         const response = await axios.post(
//             'https://api.paystack.co/transaction/initialize',
//             {
//                 email,
//                 amount,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ message: error.response.data.message });
//     }
// });

// //Handle Webhook
// router.post('/webhook', (req, res) => {
//     const signature = req.headers['x-paystack-signature'];
//     const payload = JSON.stringify(req.body);

//     const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(payload).digest('hex');

//     if (hash === signature) {
//         const event = req.body

//         if (event.event === 'charge.success') {
//             const { email } = event.data; // Extract email from event data

//             try {
//                 await 
//                 updateUserSubscription(email); // Update the user's status
//                 res.status(200).send('Subscription updated');

//             } catch(error) {
//                 console.error('Error updating subscription:', error)
//                 res.status(500).send('Error processing subscription')  
//             }
//         } else {
//             res.status(200).send('Event received')
//         }
//     } else {
//         console.error('Invalid webhook signature!')
//         res.status(400).send('Invalid signature');
//     }
// })

// Get premium content
// router.get('/premium', async (req, res) => {
//     const token = req.headers['authorization'];

//     if (!token) return res.status(403).json({ error: 'No token provided' });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id);
        
//         if (!user.isSubscribed) {
//             return res.status(403).json({ error: 'Access denied: Premium content for subscribed users only' });
//         }

//         res.json({ message: 'This is premium content!' });
//     } catch (error) {
//         res.status(401).json({ error: 'Invalid token' });
//     }
// });
// middleware/auth.js


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