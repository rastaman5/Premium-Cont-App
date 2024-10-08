const express = require('express');
const axios = require('axios')
const cors = require('cors');
const bodyParser = require('body-parser');

const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Import Transaction model

const router = express.Router();

router.use(cors());
router.use(bodyParser.json());

//Start a payment
router.post('/initialize-transaction', async (req, res) => {
  const { email, amount } = req.body;
  try {
       // Assuming you are getting user ID from a decoded JWT or session
       const user = await User.findOne({ email }); // Fetch user by email or other identifier
       if (!user) {
           return res.status(404).json({ error: 'User not found' });
       }

       console.log('Using Paystack Secret Key:', process.env.PAYSTACK_SECRET_KEY);
       
      const response = await axios.post(
          'https://api.paystack.co/transaction/initialize',
          {
              email,
              amount,
          },
          {
              headers: {
                  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                  'Content-Type': 'application/json',
              },
          }
      );
      const transaction = new Transaction({
        userId: user._id,
        transactionId: response.data.data.reference,
        status: 'pending',
        amount: amount
      });
      await transaction.save();

     res.json({ paymentUrl: response.data.data.authorization_url, transaction_id: response.data.data.reference });
    } catch (error) {
        console.error('Payment initialization error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Payment initialization failed' });
    }
});

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




module.exports = router;