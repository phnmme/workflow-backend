const express = require('express');
const router = express.Router();
const {CheckIn , CheckOut ,getHistory} = require('../controllers/attendController');
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/check-in',authMiddleware.requireUser ,CheckIn);
router.post('/check-out',authMiddleware.requireUser ,CheckOut);
router.get('/history', authMiddleware.requireUser, getHistory);

module.exports = router;
