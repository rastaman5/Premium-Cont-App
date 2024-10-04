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