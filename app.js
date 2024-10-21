const express = require('express');
const mongoose = require('mongoose');
// const session = require('express-session');
// const User = require('./models/User');
// const MongoStore = require('connect-mongo')
// const axios = require('axios');
// const uuid = require("uuid");
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const premiumRoutes = require('./routes/premium');
const cors = require('cors');
const { serverError, notFoundError } = require('./utils/responses');

require('dotenv').config();
const PORT = process.env.PORT || 500;
const app = express()
app.use(cors())
    // Middleware
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    
//   const saveUser = async (userData) => {
//     const user = new  User(userData);
//     try {
//         await user.save();
//         console.log('User saved:', user);
//     } catch (error) {
//         console.error('Error saving user:', error);
//     } finally {
//         mongoose.connection.close();
//     }
//   }
//   const newUser = new User({
//     username: '',
//     email: "",
//     password: '',
// });
    // app.use(session({
    //     secret: process.env.SESSION_SECRET,
    //     resave: false,
    //     saveUninitialized: true,
    //     store:  MongoStore.create({
    //         mongoUrl: process.env.MONGODB_URI, collectionName: 'sessions' })
    // }));

  
// Routes

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes); // Use the new payment routes
app.use('/api/premium', premiumRoutes)

// 404 error handler
app.use(notFoundError);

// Error handling middleware
app.use(serverError)


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Using Paystack Secret Key:');

});