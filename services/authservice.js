const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AuthService = {
    async createUser(username, email, password) {
        try {

        } catch (e) {
            throw error
        }
    },
    async authenticateUser(username, password) {
        try {
            const user = await User.findOne({ username });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return { error: 'Invalid credentials' };
            }

            const token = jwt.sign({ id: user._id, isSubscribed: user.isSubscribed }, process.env.JWT_SECRET);
            return { token };
        } catch (e) {
            throw error
        }
    }

}
module.exports = AuthService;

