const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Test Supabase connection
const supabase = require('./config/supabase');
console.log('🚀 Supabase client initialized');

// Routes
app.use('/api/auth', require('./routes/auth-supabase'));
app.use('/api/problems', require('./routes/problems-supabase'));
app.use('/api/submissions', require('./routes/submissions-supabase'));
app.use('/api/users', require('./routes/users-supabase'));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FeetCode server is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FeetCode server is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 FeetCode server running on port ${PORT}`);
});