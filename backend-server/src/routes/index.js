const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const weatherRoutes = require('./weather');
const marketRoutes = require('./market');
const productRoutes = require('./products');
const orderRoutes = require('./orders');
const deliveryRoutes = require('./deliveries');
const cartRoutes = require('./cart');
const wishlistRoutes = require('./wishlist');
const reviewRoutes = require('./reviews');
const categoryRoutes = require('./categories');
const notificationRoutes = require('./notifications');
const analyticsRoutes = require('./analytics');

const router = express.Router();

// Mount auth routes
router.use('/auth', authRoutes);

// Mount user routes
router.use('/users', userRoutes);

// Mount weather routes
router.use('/weather', weatherRoutes);

// Mount market routes
router.use('/market', marketRoutes);

// Mount marketplace routes
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/reviews', reviewRoutes);
router.use('/categories', categoryRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;