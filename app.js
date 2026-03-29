require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const apiRoutes = require("./src/routes/userRoutes");

const app = express();

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: (_origin, callback) => callback(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
}));
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
  res.json({
    status: 'API is running 🚀'
  });
});
app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  console.error('🔥 Global Error Handler:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});
module.exports = app;