const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
         type: String, 
        required: true,
     //     unique: true
         },
    email: {
            type: String,
            required:true,
         },
    password: {
         type: String,
         required: true
         },
    isSubscribed: { 
        type: Boolean,
         default: false 
        },
        paymentStatus: 
        {
             type: String,
              enum: ['pending', 'completed', 'failed'],
               default: 'pending' } // New field
},
{ timestamps: true });

module.exports = mongoose.model('User', userSchema);

// const User =  mongoose.model('User', userSchema);

// module.exports = User