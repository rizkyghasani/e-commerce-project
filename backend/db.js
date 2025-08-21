const { Pool } = require('pg');

// Menggunakan variabel lingkungan dari file .env
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, // Meng-export pool untuk penggunaan lebih lanjut
};