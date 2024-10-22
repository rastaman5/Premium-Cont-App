const axios = require('axios')
const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Import Transaction model
require('dotenv').config()

const paymentController = {
    startPayment: async (req, res) => {
        const { email, amount } = req.body;
        try {
            // Fetch user by email
            const user = await User.findOne({ email }); // Adjust based on your user model
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
  
      //    console.log('Using Paystack Secret Key:', process.env.PAYSTACK_SECRET_KEY);
         
        // Initialize payment with Paystack
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

        // Create a new transaction record
        const transaction = new Transaction({
            userId: user._id,
            transactionId: response.data.data.reference,
            status: 'pending',
            amount: amount,
        });
        await transaction.save();
  
       // Respond with payment URL and transaction ID
       res.json({
        paymentUrl: response.data.data.authorization_url,
        transaction_id: response.data.data.reference,
    });
} catch (error) {
    console.error('Payment initialization error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Payment initialization failed' });
}
  },
  checkStatus:  async (req, res) => {
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
}
}


module.exports = paymentController

// const { email, amount } = req.body;
// console.log(`Received request with email: ${email}, amount: ${amount}`);

// // Simulate generating a payment URL
// if (email && amount) {
//     const paymentUrl = `https://paystack.com/transaction/initialize?email=${email}&amount=${amount}`;
//     return res.json({ paymentUrl });
// }
// return res.status(400).json({ message: "Invalid input" });
// };