const express = require('express');
const axios = require('axios')
const cors = require('cors');
const bodyParser = require('body-parser');

const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Import Transaction model


const router = express.Router();

//Start a payment
router.post('/initialize-transaction', async (req, res) => {
  const { email, amount } = req.body;
  try {
      const response = await axios.post(
          'https://api.paystack.co/transaction/initialize',
          {
              email,
              amount,
          },
          {
              headers: {
                  Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                  'Content-Type': 'application/json',
              },
          }
      );
      const transaction = new Transaction({
        userId: user._id,
        transactionId: 'txn_' + Date.now(), // Mock transaction ID (replace with actual from payment processor)
        status: 'pending',
        amount: amount
      });
      await transaction.save();

     res.json({ paymentUrl: response.data.data.authorization_url, transaction_id: response.data.data.reference });
    } catch (error) {
        res.status(500).json({ error: 'Payment initialization failed' });
    }
});

// router.post('/initiate', async (req, res) => {
//     const { userId } = req.body; // User ID should be provided in the request body
  
//     try {
//       const user = await User.findById(userId)
//         // Check if user exists
//     if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
//    // Update the payment status to 'pending' (mock payment initiation)
//    user.paymentStatus = 'pending';
//    await user.save();

    // Create a new transaction
    // const transaction = new Transaction({
    //     userId: user._id,
    //     transactionId: 'txn_' + Date.now(), // Mock transaction ID (replace with actual from payment processor)
    //     status: 'pending',
    //     amount: amount
    //   });
    //   await transaction.save();
  
       // Here you would normally integrate with your payment processor
    // For example, initiate a payment 
//     res.json({ message: 'Payment initiated. Please check back for status.' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error initiating payment' });
//   }
// });

// Check payment status
router.get('/status/:transaction_id', async (req, res) => {
  const { transaction_id } = req.params;

  try {
      const transaction = await Transaction.findOne({ transaction_id });
      if (!transaction) {
          return res.status(404).json({ error: 'Transaction not found' });
      }

      res.json(transaction);
  } catch (error) {
      res.status(500).json({ error: 'Could not fetch transaction status' });
  }
});

// Handle webhook notifications
router.post('/webhook', async (req, res) => {
  // Your webhook logic here
});


//   // Mock payment completion function
// router.post('/complete/:userId', async (req, res) => {
//     const { userId } = req.params;
  
//     try {
//       const user = await User.findById(userId);
  
//       // Check if user exists
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//        // Find the latest transaction for the user
//     const transaction = await Transaction.findOne({ userId: user._id }).sort({ createdAt: -1 });
    
//     // Update the transaction status to 'completed'
//     transaction.status = 'completed';
//     await transaction.save();

//   // Mock updating payment status to 'completed'
//     user.paymentStatus = 'completed';
//     user.isSubscribed = true; // Automatically subscribe user after successful payment
//     await user.save();

//     res.json({ message: 'Payment completed successfully.' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error completing payment' });
//   }
// });

// // Mock payment failure function
// router.post('/fail/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const user = await User.findById(userId);

//     // Check if user exists
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//       // Find the latest transaction for the user
//       const transaction = await Transaction.findOne({ userId: user._id }).sort({ createdAt: -1 });
    
//       // Update the transaction status to 'failed'
//       transaction.status = 'failed';
//       await transaction.save();
  
//     //  user.paymentStatus = 'failed';
//     // await user.save();

//     res.json({ message: 'Payment failed.' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error recording payment failure' });
//   }
// });

module.exports = router;