const express = require('express');
const router = express.Router();
const { getLogs, softDeleteLog, exportLogs } = require('../controllers/logController');
const { protect } = require('../middlewares/authMiddleware');
const { logAction } = require('../middlewares/loggingMiddleware');

router.get('/', protect, logAction, getLogs);
router.delete('/:id', protect, logAction, softDeleteLog);
router.get('/export', protect, exportLogs);

module.exports = router;
