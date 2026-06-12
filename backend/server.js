const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = [
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((url) => url.trim()) : []),
  'http://localhost:3000',
  'http://localhost:3001'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.includes(origin) || 
                      /\.vercel\.app$/.test(origin) || 
                      /^http:\/\/localhost:\d+$/.test(origin);
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from ${origin}`));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/api/db-info', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    dbName: mongoose.connection?.db?.databaseName || mongoose.connection?.name || 'not connected',
    host: mongoose.connection?.host,
    env: process.env.NODE_ENV,
  });
});
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Trigger nodemon reload for database switch
