const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const weatherRoutes = require('./weather');
const marketRoutes = require('./market');

const router = express.Router();

// Mount auth routes
router.use('/auth', authRoutes);

// Mount user routes
router.use('/users', userRoutes);

// Mount weather routes
router.use('/weather', weatherRoutes);

// Mount market routes
router.use('/market', marketRoutes);

module.exports = router;