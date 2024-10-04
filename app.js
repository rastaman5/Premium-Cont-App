const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const premiumRoutes = require('./routes/premium');
const User = require('./models/User');
require('dotenv').config();
const bodyParser = require('body-parser');
const axios = require('axios')
const cors = require('cors');


const app = express()
app.use(cors())
app.use(bodyParser.json());


    // Middleware
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    //  useNewUrlParser: true,
    //   useUnifiedTopology: true 
    })
    
  const saveUser = async (userData) => {
    const user = new  User(userData);
    try {
        await user.save();
        console.log('User saved:', user);
    } catch (error) {
        console.error('Error saving user:', error);
    } finally {
        mongoose.connection.close();
    }
  }
  const newUser = new User({
    username: '',
    email: "",
    password: '',
});
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store:  MongoStore.create({
            mongoUrl: process.env.MONGODB_URI, collectionName: 'sessions' })
    }));

  
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes); // Use the new payment routes
app.use('/api/premium', premiumRoutes)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});