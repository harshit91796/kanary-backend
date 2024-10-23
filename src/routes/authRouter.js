const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logout } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { logAction } = require('../middlewares/loggingMiddleware');

router.post('/signup', logAction, registerUser);
router.post('/login', logAction, loginUser);
router.post('/logout', protect, logAction, logout);


module.exports = router;
