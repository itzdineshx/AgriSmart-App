const express = require('express');
const { getAllItems } = require('../controllers/index');

const router = express.Router();

router.get('/items', getAllItems);

module.exports = router;