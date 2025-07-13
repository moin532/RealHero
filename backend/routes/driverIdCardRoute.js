const express = require('express');
const router = express.Router();
const { applyForIdCard, getIdCard, getIdCardByUser } = require('../controller/driverIdCardController');
const { authMiddle } = require('../middleware/auth');

router.post('/apply', authMiddle, applyForIdCard);
router.get('/:id', getIdCard);
router.get('/user/:userId', authMiddle, getIdCardByUser);

module.exports = router; 