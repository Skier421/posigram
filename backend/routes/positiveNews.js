const express = require('express');
const router = express.Router();
const { getPositiveNews } = require('../controllers/positiveNewsController');

router.get('/', getPositiveNews);

module.exports = router;
