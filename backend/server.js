// Memuat variabel lingkungan dari file .env
require('dotenv').config();

// Mengimpor Express, CORS, dan modul koneksi database
const express = require('express');
const cors = require('cors'); // Mengimpor cors
const app = express();
const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

// Middleware
app.use(express.json());
app.use(cors()); // Menggunakan CORS middleware

// Menggunakan port dari variabel lingkungan, jika tidak ada, gunakan 3001
const PORT = process.env.PORT || 3001;

// Endpoint (rute) sederhana
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Endpoint untuk menguji koneksi ke database
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.status(200).json({ 
      message: 'Database connection successful!', 
      time: result.rows[0].now 
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// Menggunakan rute API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Menjalankan server hanya jika file tidak diimpor
let server;
if (require.main === module) {
  server = app.listen(PORT, (error) => {
    if (error) {
      console.error('Failed to start server:', error);
    } else {
      console.log(`Server is running on http://localhost:${PORT}`);
    }
  });
}

// Mengekspor app dan server untuk testing
module.exports = { app, server };