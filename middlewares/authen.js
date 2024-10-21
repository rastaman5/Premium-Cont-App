const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responses');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']?.split(' ')[1];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return errorResponserorResponse(res, "Unauthorized", 401); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return errorResponse(res, err.message, 401); // Unauthorized
        }
        req.user = user; // Attach user information to the request object
        next();
    });
};

module.exports = authenticateJWT;