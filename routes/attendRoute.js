const express = require('express');
const router = express.Router();
const {CheckIn , CheckOut } = require('../controllers/attendController');
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/check-in',authMiddleware.requireUser ,CheckIn);
router.post('/check-out',authMiddleware.requireUser ,CheckOut);

module.exports = router;
