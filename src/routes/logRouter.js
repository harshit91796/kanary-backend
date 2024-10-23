const express = require('express');
const router = express.Router();
const { getLogs, softDeleteLog } = require('../controllers/logController');
const { protect } = require('../middlewares/authMiddleware');
const { logAction } = require('../middlewares/loggingMiddleware');

router.get('/', protect, logAction, getLogs);
router.delete('/:id', protect,logAction, softDeleteLog);

module.exports = router;

