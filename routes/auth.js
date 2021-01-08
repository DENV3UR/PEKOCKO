const express = require('express');
const { verify } = require('jsonwebtoken');
const router = express.Router();
const authCtrl = require('../controllers/auth');
const emailVerify = require('../middleware/email-verify');

router.post('/login', authCtrl.login);
router.post('/signup', emailVerify, authCtrl.signup);

module.exports = router;