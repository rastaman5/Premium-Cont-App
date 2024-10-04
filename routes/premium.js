// routes/premium.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const authenticateJWT = require('../routes/auth'); 

// Middleware to check if user is a subscriber
const isSubscriber = async (req, res, next) => {
    try {
        // Ensure that the authentication middleware has set req.user
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized. No user information found.' });
        }

        // Use 'User' (uppercase) to refer to the model
        const user = await User.findById(req.user.id); // Assuming 'id' is set in JWT

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (!user.isSubscribed) {
            return res.status(403).json({ error: 'Access denied, premium content only for subscribers' });
        }

        // User is subscribed; proceed to the next middleware/route handler
        next();
    
  } catch (error) {
    console.error('Error in isSubscriber middleware:', error);
    res.status(500).json({ error: 'Internal server error.' });
}
}


// Access premium content
router.get('/premium-content', authenticateJWT, isSubscriber, (req, res) => {
    res.json({ message: 'Welcome to the exclusive content!', content: 'This is premium content only for subscribers.' });
});

module.exports = router;