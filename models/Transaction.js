const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: 
    {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
           required: true 
        },
    transactionId:
     {
         type: String,
          required: true,
           unique: true 
        }, // Transaction ID from the payment processor
    status: 
    { 
        type: String,
         enum: ['pending', 'completed', 'failed'],
          default: 'pending' 
        },
    amount:
     {
         type: Number,
          required: true 
        }
  },
   { timestamps: true });
  
  module.exports = mongoose.model('Transaction', transactionSchema);