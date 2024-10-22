const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');

const {startPayment, checkStatus} = require('../controllers/payment.controller');

router.use(cors());
router.use(bodyParser.json());

//Start a payment
router.post('/initialize-transaction', startPayment);
// Check payment status
router.get('/status/:transaction_id', checkStatus);

// Handle webhook notifications
router.post('/webhook', async (req, res) => {
// Your webhook logic here
// Middleware to check if user is a subscriber


});




module.exports = router;