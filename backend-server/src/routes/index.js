const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const { getAllItems } = require('../controllers/index');

const router = express.Router();

// Mount auth routes
router.use('/auth', authRoutes);

// Mount user routes
router.use('/users', userRoutes);

// Existing routes
router.get('/items', getAllItems);

module.exports = router;