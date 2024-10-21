const User = require('../models/User')
const { errorResponse } = require('../utils/responses');

  // Middleware to check if user is a subscriber
const isSubscriber = async (req, res, next) => {
    try {
        //find authenticated user
        const user = await User.findOne({_id:req.user.id}); // Assuming 'id' is set in JWT
        if (!user.isSubscribed) {
            return errorResponse(res, 'You are not a subscriber', 403);
        }
        next();
        // Ensure that the authentication middleware has set req.user
        // if (!req.user) {
        //     return res.status(401).json({ error: 'Unauthorized. No user information found.' });
        // }

        // // Use 'User' (uppercase) to refer to the model
        // const user = await User.findById(req.user.id); // Assuming 'id' is set in JWT

        // if (!user) {
        //     return res.status(404).json({ error: 'User not found.' });
        // }
     
        // User is subscribed; proceed to the next middleware/route handler
      
    
  } catch (error) {
    console.error('Error in isSubscriber middleware:', error);
    return errorResponse(res, error.message, 500);
}
}

  module.exports = isSubscriber