const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/index');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
console.log('Environment variables loaded:', { PORT: process.env.PORT, MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET' });

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default port
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection (optional for testing)
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    })
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        global.dbConnected = true;
    })
    .catch(err => {
        console.warn('⚠️  MongoDB connection failed (continuing with mock data):', err.message);
        global.dbConnected = false;
    });
} else {
    console.warn('⚠️  No MONGODB_URI provided (running with mock data only)');
    global.dbConnected = false;
}

// Routes
app.use('/api', routes);

// API Documentation endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'AgriSmart Backend API',
        version: '1.0.0',
        status: 'Running',
        endpoints: {
            health: {
                method: 'GET',
                url: '/health',
                description: 'Health check endpoint'
            },
            auth: {
                register: {
                    method: 'POST',
                    url: '/api/auth/register',
                    description: 'User registration',
                    body: '{ name, email, password, role? }'
                },
                login: {
                    method: 'POST',
                    url: '/api/auth/login',
                    description: 'User login',
                    body: '{ email, password }'
                },
                me: {
                    method: 'GET',
                    url: '/api/auth/me',
                    description: 'Get current user info',
                    headers: { Authorization: 'Bearer <token>' }
                },
                logout: {
                    method: 'POST',
                    url: '/api/auth/logout',
                    description: 'User logout'
                },
                refreshToken: {
                    method: 'POST',
                    url: '/api/auth/refresh-token',
                    description: 'Refresh access token',
                    body: '{ refreshToken }'
                },
                roles: {
                    method: 'GET',
                    url: '/api/auth/roles',
                    description: 'Get available roles'
                }
            },
            weather: {
                current: {
                    method: 'GET',
                    url: '/api/weather/current?city={city}&lat={lat}&lon={lon}',
                    description: 'Get current weather data'
                },
                forecast: {
                    method: 'GET',
                    url: '/api/weather/forecast?city={city}&days={days}',
                    description: 'Get weather forecast'
                },
                alerts: {
                    method: 'GET',
                    url: '/api/weather/alerts?city={city}',
                    description: 'Get weather alerts'
                }
            },
            market: {
                prices: {
                    method: 'GET',
                    url: '/api/market/prices?commodity={commodity}&state={state}&limit={limit}',
                    description: 'Get market prices'
                },
                pricesByCommodity: {
                    method: 'GET',
                    url: '/api/market/prices/{commodity}?state={state}&limit={limit}',
                    description: 'Get prices for specific commodity'
                },
                trends: {
                    method: 'GET',
                    url: '/api/market/trends?commodity={commodity}&period={period}',
                    description: 'Get market trends'
                },
                analysis: {
                    method: 'GET',
                    url: '/api/market/analysis?commodity={commodity}',
                    description: 'Get market analysis'
                }
            }
        },
        database: global.dbConnected ? 'Connected' : 'Mock Mode',
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});