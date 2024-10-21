const User = require('../models/User');

const checkIfUserExists = async (req, res, next) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({error: 'User already exists with this email.'});
        }
        next();
    }
    catch (error) {
        res.status(500).json({error: 'Error checking user'});
    }
}

module.exports = checkIfUserExists;