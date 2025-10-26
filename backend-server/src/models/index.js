const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'farmer', 'buyer'],
        default: 'buyer'
    },
    // Farmer specific fields
    farmerProfile: {
        farmName: String,
        farmSize: String, // e.g., "15 acres"
        location: {
            address: String,
            city: String,
            state: String,
            pincode: String,
            coordinates: {
                lat: Number,
                lng: Number
            }
        },
        crops: [String], // Array of crop names
        experience: String, // e.g., "12 years"
        certifications: [String], // Organic, etc.
        contactNumber: String
    },
    // Buyer specific fields
    buyerProfile: {
        businessName: String,
        businessType: {
            type: String,
            enum: ['individual', 'retail', 'wholesale', 'restaurant', 'cooperative']
        },
        preferredProducts: [String], // Product categories they buy
        deliveryAddress: {
            address: String,
            city: String,
            state: String,
            pincode: String,
            coordinates: {
                lat: Number,
                lng: Number
            }
        },
        gstNumber: String
    },
    avatar: {
        type: String, // URL to avatar image
        default: null
    },
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        },
        language: {
            type: String,
            default: 'en'
        },
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            weather: { type: Boolean, default: true },
            market: { type: Boolean, default: true }
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Product Model
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['seeds', 'fertilizers', 'tools', 'pesticides', 'equipment', 'other'],
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    unit: {
        type: String,
        required: true,
        default: 'kg'
    },
    organic: {
        type: Boolean,
        default: false
    },
    location: {
        address: String,
        city: String,
        state: String,
        pincode: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Order Model
const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        price: Number,
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        unit: String,
        total: Number
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: {
        type: Date
    },
    shippingAddress: {
        name: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        phone: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'online', 'upi'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    trackingId: {
        type: String,
        unique: true,
        sparse: true
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Delivery Model
const deliverySchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed'],
        default: 'pending'
    },
    trackingId: {
        type: String,
        required: true,
        unique: true
    },
    deliveryPartner: {
        name: String,
        contact: String,
        vehicleNumber: String
    },
    estimatedDeliveryDate: Date,
    actualDeliveryDate: Date,
    deliveryAddress: {
        name: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        phone: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    currentLocation: {
        coordinates: {
            lat: Number,
            lng: Number
        },
        address: String,
        timestamp: Date
    },
    notes: String,
    proofOfDelivery: {
        signature: String,
        photo: String,
        timestamp: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Cart Model
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Wishlist Model
const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound index to prevent duplicate wishlist items
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

// Review Model
const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        maxlength: 100
    },
    comment: {
        type: String,
        maxlength: 1000
    },
    images: [{
        url: String,
        alt: String
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    helpful: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Category Model
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    image: String,
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Notification Model
const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['order_placed', 'order_confirmed', 'order_shipped', 'order_delivered', 'order_cancelled', 'product_review', 'payment_received', 'low_stock', 'new_message'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        orderId: mongoose.Schema.Types.ObjectId,
        productId: mongoose.Schema.Types.ObjectId,
        amount: Number,
        quantity: Number
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Weather Data Models
const weatherCurrentSchema = new mongoose.Schema({
    location: {
        city: String,
        state: String,
        country: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    temperature: {
        current: Number,
        feelsLike: Number,
        min: Number,
        max: Number,
        unit: { type: String, default: 'celsius' }
    },
    humidity: Number,
    pressure: Number,
    wind: {
        speed: Number,
        direction: Number,
        unit: { type: String, default: 'kmh' }
    },
    visibility: Number,
    uvIndex: Number,
    conditions: {
        main: String,
        description: String,
        icon: String
    },
    precipitation: {
        probability: Number,
        amount: Number,
        type: String // rain, snow, etc.
    },
    sunrise: Date,
    sunset: Date,
    lastUpdated: { type: Date, default: Date.now },
    source: { type: String, default: 'openmeteo' }
});

const weatherForecastSchema = new mongoose.Schema({
    location: {
        city: String,
        state: String,
        country: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    forecast: [{
        date: Date,
        temperature: {
            min: Number,
            max: Number,
            unit: { type: String, default: 'celsius' }
        },
        humidity: Number,
        wind: {
            speed: Number,
            direction: Number,
            unit: { type: String, default: 'kmh' }
        },
        conditions: {
            main: String,
            description: String,
            icon: String
        },
        precipitation: {
            probability: Number,
            amount: Number,
            type: String
        },
        uvIndex: Number
    }],
    lastUpdated: { type: Date, default: Date.now },
    source: { type: String, default: 'openmeteo' }
});

const weatherAlertSchema = new mongoose.Schema({
    location: {
        city: String,
        state: String,
        country: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    alert: {
        title: String,
        description: String,
        severity: {
            type: String,
            enum: ['minor', 'moderate', 'severe', 'extreme'],
            default: 'moderate'
        },
        urgency: {
            type: String,
            enum: ['immediate', 'expected', 'future'],
            default: 'expected'
        },
        areas: [String],
        startTime: Date,
        endTime: Date,
        source: String
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const weatherSubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        city: String,
        state: String,
        country: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    alertTypes: [{
        type: String,
        enum: ['rain', 'storm', 'heat', 'cold', 'wind', 'flood', 'drought']
    }],
    notificationMethods: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Market Data Models
const marketPriceSchema = new mongoose.Schema({
    commodity: {
        type: String,
        required: true,
        enum: ['wheat', 'rice', 'maize', 'cotton', 'sugarcane', 'potato', 'tomato', 'onion', 'apple', 'banana']
    },
    market: {
        name: String,
        city: String,
        state: String,
        mandiId: String
    },
    price: {
        min: Number,
        max: Number,
        modal: Number,
        unit: { type: String, default: '₹/quintal' }
    },
    date: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    source: { type: String, default: 'data.gov.in' }
});

const marketTrendSchema = new mongoose.Schema({
    commodity: {
        type: String,
        required: true
    },
    period: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
    },
    trend: {
        direction: {
            type: String,
            enum: ['up', 'down', 'stable'],
            default: 'stable'
        },
        percentage: Number,
        priceChange: Number
    },
    data: [{
        date: Date,
        price: Number,
        volume: Number
    }],
    lastUpdated: { type: Date, default: Date.now },
    source: { type: String, default: 'data.gov.in' }
});

const marketAlertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commodity: String,
    condition: {
        type: {
            type: String,
            enum: ['price_above', 'price_below', 'price_change'],
            default: 'price_above'
        },
        value: Number,
        unit: { type: String, default: '₹/quintal' }
    },
    isActive: { type: Boolean, default: true },
    triggeredAt: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

weatherAlertSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

weatherSubscriptionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

marketAlertSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model('User', userSchema);
const WeatherCurrent = mongoose.model('WeatherCurrent', weatherCurrentSchema);
const WeatherForecast = mongoose.model('WeatherForecast', weatherForecastSchema);
const WeatherAlert = mongoose.model('WeatherAlert', weatherAlertSchema);
const WeatherSubscription = mongoose.model('WeatherSubscription', weatherSubscriptionSchema);
const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);
const MarketTrend = mongoose.model('MarketTrend', marketTrendSchema);
const MarketAlert = mongoose.model('MarketAlert', marketAlertSchema);

// Marketplace Models
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Delivery = mongoose.model('Delivery', deliverySchema);
const Cart = mongoose.model('Cart', cartSchema);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
const Review = mongoose.model('Review', reviewSchema);
const Category = mongoose.model('Category', categorySchema);
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = {
    User,
    Product,
    Order,
    Delivery,
    Cart,
    Wishlist,
    Review,
    Category,
    Notification,
    WeatherCurrent,
    WeatherForecast,
    WeatherAlert,
    WeatherSubscription,
    MarketPrice,
    MarketTrend,
    MarketAlert
};