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
        enum: ['admin', 'seller', 'user'],
        default: 'user'
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

module.exports = {
    User,
    WeatherCurrent,
    WeatherForecast,
    WeatherAlert,
    WeatherSubscription,
    MarketPrice,
    MarketTrend,
    MarketAlert
};