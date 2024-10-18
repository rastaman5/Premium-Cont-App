// routes/premium.js
const express = require('express');
// const User = require('../models/User');
const router = express.Router();
const authenticateJWT = require('./auth'); 
const isSubscriber = require('../middlewares/isSubscriber'); // Import the new isSubscriber middleware




// Access premium content
router.get('/premium-content', authenticateJWT, isSubscriber, (req, res) => {
    res.json({ message: 'Welcome to the exclusive content!', content: 'This is premium content only for subscribers.' });
});

module.exports = router;