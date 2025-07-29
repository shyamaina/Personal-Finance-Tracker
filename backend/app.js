const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const authRoutes = require('./src/routes/authRoutes');
const { authLimiter } = require('./src/utils/rateLimiters');
app.use('/api/auth', authLimiter, authRoutes);

const transactionRoutes = require('./src/routes/transactionRoutes');
const { transactionLimiter } = require('./src/utils/rateLimiters');
app.use('/api/transactions', transactionLimiter, transactionRoutes);

const categoryRoutes = require('./src/routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);

const analyticsRoutes = require('./src/routes/analyticsRoutes');
const { analyticsLimiter } = require('./src/utils/rateLimiters');
app.use('/api/analytics', analyticsLimiter, analyticsRoutes);

module.exports = app; 