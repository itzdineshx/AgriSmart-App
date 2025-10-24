const { User } = require('../models/index');
const { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, generateResetToken } = require('../utils/auth');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Weather Controllers
const getCurrentWeather = async (req, res) => {
    try {
        const { lat, lon, city } = req.query;

        // Mock weather data
        const mockWeather = {
            location: {
                name: city || 'Delhi',
                region: 'Delhi',
                country: 'India',
                lat: lat || 28.6139,
                lon: lon || 77.2090,
                tz_id: 'Asia/Kolkata',
                localtime_epoch: Math.floor(Date.now() / 1000),
                localtime: new Date().toISOString()
            },
            current: {
                last_updated_epoch: Math.floor(Date.now() / 1000),
                last_updated: new Date().toISOString(),
                temp_c: Math.floor(Math.random() * 15) + 20, // 20-35°C
                temp_f: 0, // Will be calculated
                is_day: new Date().getHours() > 6 && new Date().getHours() < 18 ? 1 : 0,
                condition: {
                    text: 'Sunny',
                    icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
                    code: 1000
                },
                wind_mph: Math.floor(Math.random() * 10) + 5,
                wind_kph: Math.floor(Math.random() * 16) + 8,
                wind_degree: Math.floor(Math.random() * 360),
                wind_dir: 'NE',
                pressure_mb: Math.floor(Math.random() * 20) + 1000,
                pressure_in: 0, // Will be calculated
                precip_mm: Math.random() * 5,
                precip_in: 0, // Will be calculated
                humidity: Math.floor(Math.random() * 30) + 40,
                cloud: Math.floor(Math.random() * 50),
                feelslike_c: Math.floor(Math.random() * 15) + 20,
                feelslike_f: 0, // Will be calculated
                vis_km: Math.floor(Math.random() * 5) + 5,
                vis_miles: 0, // Will be calculated
                uv: Math.floor(Math.random() * 10),
                gust_mph: Math.floor(Math.random() * 15) + 10,
                gust_kph: Math.floor(Math.random() * 24) + 16
            }
        };

        // Calculate derived values
        mockWeather.current.temp_f = Math.round((mockWeather.current.temp_c * 9/5) + 32);
        mockWeather.current.pressure_in = Math.round(mockWeather.current.pressure_mb * 0.02953 * 100) / 100;
        mockWeather.current.precip_in = Math.round(mockWeather.current.precip_mm * 0.03937 * 100) / 100;
        mockWeather.current.feelslike_f = Math.round((mockWeather.current.feelslike_c * 9/5) + 32);
        mockWeather.current.vis_miles = Math.round(mockWeather.current.vis_km * 0.621371 * 100) / 100;

        res.json(mockWeather);
    } catch (error) {
        console.error('Get current weather error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getWeatherForecast = async (req, res) => {
    try {
        const { lat, lon, city, days = 7 } = req.query;

        // Mock forecast data
        const forecast = {
            location: {
                name: city || 'Delhi',
                region: 'Delhi',
                country: 'India',
                lat: lat || 28.6139,
                lon: lon || 77.2090,
                tz_id: 'Asia/Kolkata',
                localtime_epoch: Math.floor(Date.now() / 1000),
                localtime: new Date().toISOString()
            },
            current: {
                last_updated_epoch: Math.floor(Date.now() / 1000),
                last_updated: new Date().toISOString(),
                temp_c: Math.floor(Math.random() * 15) + 20,
                temp_f: Math.floor(Math.random() * 15) + 68,
                is_day: 1,
                condition: {
                    text: 'Sunny',
                    icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
                    code: 1000
                },
                wind_mph: Math.floor(Math.random() * 10) + 5,
                wind_kph: Math.floor(Math.random() * 16) + 8,
                wind_degree: Math.floor(Math.random() * 360),
                wind_dir: 'NE',
                pressure_mb: Math.floor(Math.random() * 20) + 1000,
                pressure_in: Math.floor(Math.random() * 0.6) + 29.8,
                precip_mm: Math.random() * 5,
                precip_in: Math.random() * 0.2,
                humidity: Math.floor(Math.random() * 30) + 40,
                cloud: Math.floor(Math.random() * 50),
                feelslike_c: Math.floor(Math.random() * 15) + 20,
                feelslike_f: Math.floor(Math.random() * 15) + 68,
                vis_km: Math.floor(Math.random() * 5) + 5,
                vis_miles: Math.floor(Math.random() * 3) + 3,
                uv: Math.floor(Math.random() * 10),
                gust_mph: Math.floor(Math.random() * 15) + 10,
                gust_kph: Math.floor(Math.random() * 24) + 16
            },
            forecast: {
                forecastday: []
            }
        };

        // Generate forecast days
        for (let i = 0; i < parseInt(days); i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);

            const dayData = {
                date: date.toISOString().split('T')[0],
                date_epoch: Math.floor(date.getTime() / 1000),
                day: {
                    maxtemp_c: Math.floor(Math.random() * 10) + 25,
                    maxtemp_f: Math.floor(Math.random() * 18) + 77,
                    mintemp_c: Math.floor(Math.random() * 10) + 15,
                    mintemp_f: Math.floor(Math.random() * 18) + 59,
                    avgtemp_c: Math.floor(Math.random() * 10) + 20,
                    avgtemp_f: Math.floor(Math.random() * 18) + 68,
                    maxwind_mph: Math.floor(Math.random() * 15) + 10,
                    maxwind_kph: Math.floor(Math.random() * 24) + 16,
                    totalprecip_mm: Math.random() * 10,
                    totalprecip_in: Math.random() * 0.4,
                    totalsnow_cm: 0,
                    avgvis_km: Math.floor(Math.random() * 5) + 5,
                    avgvis_miles: Math.floor(Math.random() * 3) + 3,
                    avghumidity: Math.floor(Math.random() * 30) + 40,
                    daily_will_it_rain: Math.random() > 0.7 ? 1 : 0,
                    daily_chance_of_rain: Math.floor(Math.random() * 100),
                    daily_will_it_snow: 0,
                    daily_chance_of_snow: 0,
                    condition: {
                        text: Math.random() > 0.7 ? 'Partly cloudy' : 'Sunny',
                        icon: Math.random() > 0.7 ? '//cdn.weatherapi.com/weather/64x64/day/116.png' : '//cdn.weatherapi.com/weather/64x64/day/113.png',
                        code: Math.random() > 0.7 ? 1003 : 1000
                    },
                    uv: Math.floor(Math.random() * 10)
                },
                astro: {
                    sunrise: '06:30 AM',
                    sunset: '06:30 PM',
                    moonrise: '08:45 PM',
                    moonset: '08:30 AM',
                    moon_phase: 'Waning Gibbous',
                    moon_illumination: '78',
                    is_moon_up: 0,
                    is_sun_up: 1
                },
                hour: [] // Would contain hourly data
            };

            forecast.forecast.forecastday.push(dayData);
        }

        res.json(forecast);
    } catch (error) {
        console.error('Get weather forecast error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getWeatherHistory = async (req, res) => {
    try {
        const { lat, lon, city, date } = req.query;

        // Mock historical weather data
        const history = {
            location: {
                name: city || 'Delhi',
                region: 'Delhi',
                country: 'India',
                lat: lat || 28.6139,
                lon: lon || 77.2090,
                tz_id: 'Asia/Kolkata',
                localtime_epoch: Math.floor(Date.now() / 1000),
                localtime: new Date().toISOString()
            },
            forecast: {
                forecastday: [{
                    date: date || new Date().toISOString().split('T')[0],
                    date_epoch: Math.floor(Date.now() / 1000),
                    day: {
                        maxtemp_c: Math.floor(Math.random() * 10) + 25,
                        maxtemp_f: Math.floor(Math.random() * 18) + 77,
                        mintemp_c: Math.floor(Math.random() * 10) + 15,
                        mintemp_f: Math.floor(Math.random() * 18) + 59,
                        avgtemp_c: Math.floor(Math.random() * 10) + 20,
                        avgtemp_f: Math.floor(Math.random() * 18) + 68,
                        maxwind_mph: Math.floor(Math.random() * 15) + 10,
                        maxwind_kph: Math.floor(Math.random() * 24) + 16,
                        totalprecip_mm: Math.random() * 10,
                        totalprecip_in: Math.random() * 0.4,
                        totalsnow_cm: 0,
                        avgvis_km: Math.floor(Math.random() * 5) + 5,
                        avgvis_miles: Math.floor(Math.random() * 3) + 3,
                        avghumidity: Math.floor(Math.random() * 30) + 40,
                        daily_will_it_rain: Math.random() > 0.7 ? 1 : 0,
                        daily_chance_of_rain: Math.floor(Math.random() * 100),
                        daily_will_it_snow: 0,
                        daily_chance_of_snow: 0,
                        condition: {
                            text: Math.random() > 0.7 ? 'Partly cloudy' : 'Sunny',
                            icon: Math.random() > 0.7 ? '//cdn.weatherapi.com/weather/64x64/day/116.png' : '//cdn.weatherapi.com/weather/64x64/day/113.png',
                            code: Math.random() > 0.7 ? 1003 : 1000
                        },
                        uv: Math.floor(Math.random() * 10)
                    },
                    astro: {
                        sunrise: '06:30 AM',
                        sunset: '06:30 PM',
                        moonrise: '08:45 PM',
                        moonset: '08:30 AM',
                        moon_phase: 'Waning Gibbous',
                        moon_illumination: '78',
                        is_moon_up: 0,
                        is_sun_up: 1
                    },
                    hour: [] // Historical hourly data would go here
                }]
            }
        };

        res.json(history);
    } catch (error) {
        console.error('Get weather history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getWeatherAlerts = async (req, res) => {
    try {
        const { lat, lon, city } = req.query;

        // Mock weather alerts
        const alerts = {
            alerts: {
                alert: [
                    {
                        headline: 'Heavy Rain Warning',
                        msgtype: 'Alert',
                        severity: 'Moderate',
                        urgency: 'Immediate',
                        areas: city || 'Delhi',
                        category: 'Met',
                        certainty: 'Likely',
                        event: 'Heavy Rain',
                        note: 'Heavy rainfall expected in the next 24 hours',
                        effective: new Date().toISOString(),
                        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                        desc: 'Heavy rainfall with possible flooding in low-lying areas',
                        instruction: 'Avoid travel in affected areas and stay indoors'
                    }
                ]
            }
        };

        res.json(alerts);
    } catch (error) {
        console.error('Get weather alerts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const subscribeWeatherAlerts = async (req, res) => {
    try {
        const userId = req.user._id;
        const { location, alertTypes } = req.body;

        // Mock subscription
        const subscription = {
            userId,
            location,
            alertTypes: alertTypes || ['rain', 'storm', 'heat'],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        res.status(201).json({
            message: 'Weather alert subscription created successfully',
            subscription
        });
    } catch (error) {
        console.error('Subscribe weather alerts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const unsubscribeWeatherAlerts = async (req, res) => {
    try {
        const userId = req.user._id;
        const { subscriptionId } = req.params;

        // Mock unsubscription
        res.json({ message: 'Weather alert subscription cancelled successfully' });
    } catch (error) {
        console.error('Unsubscribe weather alerts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, role = 'user' } = req.body;

        // For now, always use mock mode for testing
        console.log('Using mock registration mode for testing');
        const mockUser = {
            _id: 'mock_' + Date.now(),
            name,
            email,
            role,
            createdAt: new Date()
        };

        const accessToken = generateAccessToken(mockUser._id);
        const refreshToken = generateRefreshToken(mockUser._id);

        return res.status(201).json({
            message: 'User registered successfully (mock mode)',
            user: mockUser,
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // For now, always use mock mode for testing
        console.log('Using mock login mode for testing');
        const mockUser = {
            _id: 'mock_' + Date.now(),
            name: email.split('@')[0],
            email,
            role: 'user',
            avatar: null,
            preferences: {},
            lastLogin: new Date()
        };

        const accessToken = generateAccessToken(mockUser._id);
        const refreshToken = generateRefreshToken(mockUser._id);

        return res.json({
            message: 'Login successful (mock mode)',
            user: mockUser,
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const logout = async (req, res) => {
    try {
        // In a stateless JWT system, logout is handled client-side
        // You might want to implement token blacklisting for enhanced security
        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            return res.status(401).json({ message: 'Refresh token required' });
        }

        // Verify refresh token
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Generate new tokens
        const accessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        res.json({
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = req.user;
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            preferences: user.preferences,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        };

        res.json({ user: userResponse });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if email exists or not for security
            return res.json({ message: 'If the email exists, a reset link has been sent' });
        }

        // Generate reset token
        const resetToken = generateResetToken();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // TODO: Send email with reset link
        // For now, just return the token (in production, send via email)
        res.json({
            message: 'If the email exists, a reset link has been sent',
            resetToken // Remove this in production
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { token, newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Role-based access controllers
const getRoles = async (req, res) => {
    try {
        const roles = ['admin', 'seller', 'user'];
        res.json({ roles });
    } catch (error) {
        console.error('Get roles error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const assignRole = async (req, res) => {
    try {
        const { userId, role } = req.body;

        if (!['admin', 'seller', 'user'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({ message: 'Role assigned successfully', user: { _id: user._id, role: user.role } });
    } catch (error) {
        console.error('Assign role error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserRole = async (req, res) => {
    try {
        const user = req.user;
        res.json({ role: user.role });
    } catch (error) {
        console.error('Get user role error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// User management controllers
const getProfile = async (req, res) => {
    try {
        const user = req.user;
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            preferences: user.preferences,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        };

        res.json({ user: userResponse });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email } = req.body;
        const user = req.user;

        // Check if email is being changed and if it's already taken
        if (email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;
        await user.save();

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            preferences: user.preferences
        };

        res.json({ message: 'Profile updated successfully', user: userResponse });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        // TODO: Implement file upload logic
        // For now, just accept a URL
        const { avatarUrl } = req.body;
        const user = req.user;

        user.avatar = avatarUrl;
        await user.save();

        res.json({ message: 'Avatar updated successfully', avatar: user.avatar });
    } catch (error) {
        console.error('Upload avatar error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteAvatar = async (req, res) => {
    try {
        const user = req.user;
        user.avatar = null;
        await user.save();

        res.json({ message: 'Avatar deleted successfully' });
    } catch (error) {
        console.error('Delete avatar error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updatePreferences = async (req, res) => {
    try {
        const { preferences } = req.body;
        const user = req.user;

        user.preferences = { ...user.preferences, ...preferences };
        await user.save();

        res.json({ message: 'Preferences updated successfully', preferences: user.preferences });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Weather Controllers
const getMarketPrices = async (req, res) => {
    try {
        const { commodity, state, district, limit = 50 } = req.query;

        // Mock market price data
        const commodities = ['wheat', 'rice', 'maize', 'cotton', 'sugarcane', 'potato', 'tomato', 'onion'];
        const states = ['Delhi', 'Haryana', 'Punjab', 'Uttar Pradesh', 'Rajasthan', 'Maharashtra'];

        const mockPrices = [];
        for (let i = 0; i < parseInt(limit); i++) {
            const selectedCommodity = commodity || commodities[Math.floor(Math.random() * commodities.length)];
            const selectedState = state || states[Math.floor(Math.random() * states.length)];

            mockPrices.push({
                commodity: selectedCommodity,
                market: {
                    name: `${selectedState} Mandi ${i + 1}`,
                    city: selectedState,
                    state: selectedState,
                    mandiId: `MANDI${String(i + 1).padStart(3, '0')}`
                },
                price: {
                    min: Math.floor(Math.random() * 1000) + 500,
                    max: Math.floor(Math.random() * 1000) + 1500,
                    modal: Math.floor(Math.random() * 1000) + 1000,
                    unit: '₹/quintal'
                },
                date: new Date(),
                lastUpdated: new Date(),
                source: 'data.gov.in'
            });
        }

        res.json({ prices: mockPrices, total: mockPrices.length });
    } catch (error) {
        console.error('Get market prices error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMarketPricesByCommodity = async (req, res) => {
    try {
        const { commodity } = req.params;
        const { state, limit = 20 } = req.query;

        // Mock data for specific commodity
        const mockPrices = [];
        for (let i = 0; i < parseInt(limit); i++) {
            mockPrices.push({
                commodity,
                market: {
                    name: `Market ${i + 1}`,
                    city: `City ${i + 1}`,
                    state: state || 'Delhi',
                    mandiId: `MANDI${String(i + 1).padStart(3, '0')}`
                },
                price: {
                    min: Math.floor(Math.random() * 500) + 800,
                    max: Math.floor(Math.random() * 500) + 1300,
                    modal: Math.floor(Math.random() * 500) + 1000,
                    unit: '₹/quintal'
                },
                date: new Date(),
                lastUpdated: new Date(),
                source: 'data.gov.in'
            });
        }

        res.json({ commodity, prices: mockPrices });
    } catch (error) {
        console.error('Get market prices by commodity error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMarketPriceHistory = async (req, res) => {
    try {
        const { commodity } = req.params;
        const { days = 30 } = req.query;

        // Mock historical data
        const history = [];
        const baseDate = new Date();

        for (let i = parseInt(days); i >= 0; i--) {
            const date = new Date(baseDate);
            date.setDate(date.getDate() - i);

            history.push({
                date,
                commodity,
                price: {
                    min: Math.floor(Math.random() * 300) + 700,
                    max: Math.floor(Math.random() * 300) + 1200,
                    modal: Math.floor(Math.random() * 300) + 900,
                    unit: '₹/quintal'
                },
                volume: Math.floor(Math.random() * 1000) + 100,
                market: 'Delhi Mandi'
            });
        }

        res.json({ commodity, history });
    } catch (error) {
        console.error('Get market price history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMarketTrends = async (req, res) => {
    try {
        const { commodity, period = 'weekly' } = req.query;

        // Mock trend data
        const commodities = commodity ? [commodity] : ['wheat', 'rice', 'maize', 'cotton'];
        const trends = [];

        commodities.forEach(comm => {
            const direction = Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable';
            const percentage = direction === 'stable' ? 0 : Math.random() * 20;

            trends.push({
                commodity: comm,
                period,
                trend: {
                    direction,
                    percentage: Math.round(percentage * 100) / 100,
                    priceChange: direction === 'up' ? Math.round(Math.random() * 200) :
                               direction === 'down' ? -Math.round(Math.random() * 200) : 0
                },
                data: [], // Would contain historical data points
                lastUpdated: new Date(),
                source: 'data.gov.in'
            });
        });

        res.json({ trends });
    } catch (error) {
        console.error('Get market trends error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMarketAnalysis = async (req, res) => {
    try {
        const { commodity } = req.query;

        // Mock analysis data
        const analysis = {
            commodity: commodity || 'wheat',
            summary: {
                currentPrice: 1200,
                priceChange24h: Math.random() > 0.5 ? Math.random() * 100 : -Math.random() * 100,
                priceChange7d: Math.random() > 0.5 ? Math.random() * 300 : -Math.random() * 300,
                volatility: Math.random() * 20,
                trend: Math.random() > 0.5 ? 'bullish' : 'bearish'
            },
            insights: [
                'Prices are expected to rise due to increased demand',
                'Weather conditions are favorable for the upcoming harvest',
                'Supply chain disruptions may affect availability'
            ],
            recommendations: [
                'Consider selling if prices reach target levels',
                'Monitor weather updates for harvest predictions',
                'Diversify storage locations to minimize risk'
            ],
            lastUpdated: new Date()
        };

        res.json({ analysis });
    } catch (error) {
        console.error('Get market analysis error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createMarketPriceAlert = async (req, res) => {
    try {
        const userId = req.user._id;
        const { commodity, condition } = req.body;

        // Mock alert creation
        const alert = {
            userId,
            commodity,
            condition,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        res.status(201).json({
            message: 'Market price alert created successfully',
            alert
        });
    } catch (error) {
        console.error('Create market price alert error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteMarketPriceAlert = async (req, res) => {
    try {
        const userId = req.user._id;
        const { alertId } = req.params;

        // Mock alert deletion
        res.json({ message: 'Market price alert deleted successfully' });
    } catch (error) {
        console.error('Delete market price alert error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    // Auth controllers
    register,
    login,
    logout,
    refreshToken,
    getMe,
    forgotPassword,
    resetPassword,
    getRoles,
    assignRole,
    getUserRole,

    // User controllers
    getProfile,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    updatePreferences,

    // Weather controllers
    getCurrentWeather,
    getWeatherForecast,
    getWeatherHistory,
    getWeatherAlerts,
    subscribeWeatherAlerts,
    unsubscribeWeatherAlerts,

    // Market controllers
    getMarketPrices,
    getMarketPricesByCommodity,
    getMarketPriceHistory,
    getMarketTrends,
    getMarketAnalysis,
    createMarketPriceAlert,
    deleteMarketPriceAlert
};