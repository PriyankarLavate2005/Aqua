const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, verifyOTP } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);

module.exports = router;
