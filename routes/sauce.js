const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, sauceCtrl.getall);
router.post('/', auth, multer, sauceCtrl.create);
router.get('/:id', auth, sauceCtrl.getOne);
router.post('/:id/like', auth, sauceCtrl.updateLikes);
module.exports = router;