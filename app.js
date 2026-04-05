require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
// const cors = require('cors');


// app.use(cors({
//   origin: 'https://petrajuniors.org/', 
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

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

app.use('/images', express.static(path.join(__dirname, 'src', 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

app.get('/', (req, res) => {
  res.json({
    status: 'API is running 🚀'
  });
});
app.use('/api', apiRoutes);
app.use('/api/users', apiRoutes); 
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/subcategories', require('./src/routes/subcategories'));
app.use('/api/services', require('./src/routes/services'));
app.use('/api/provider/services', require('./src/routes/providerServices'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/admin/services', require('./src/routes/adminServicesRoutes'));

app.use((err, req, res, next) => {
  console.error('🔥 Global Error Handler:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});
module.exports = app;