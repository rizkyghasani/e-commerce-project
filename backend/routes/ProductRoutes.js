const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, isSeller } = require('../middleware/authMiddleware');

// Rute untuk mendapatkan semua produk (akses publik)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rute untuk mendapatkan produk-produk yang diunggah oleh penjual yang sedang login
router.get('/seller', protect, isSeller, async (req, res) => {
  const seller_id = req.user.id;
  try {
    const result = await db.query('SELECT * FROM products WHERE seller_id = $1', [seller_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rute untuk menambahkan produk baru
router.post('/add', protect, isSeller, async (req, res) => {
  const { name, description, price, image_url } = req.body;
  const seller_id = req.user.id;

  try {
    const result = await db.query(
      'INSERT INTO products (name, description, price, image_url, seller_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, image_url, seller_id]
    );
    res.status(201).json({ 
      message: 'Product added successfully!', 
      product: result.rows[0] 
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rute untuk mengedit produk yang sudah ada
router.put('/:id', protect, isSeller, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url } = req.body;
  const seller_id = req.user.id;

  try {
    const result = await db.query(
      'UPDATE products SET name = $1, description = $2, price = $3, image_url = $4 WHERE id = $5 AND seller_id = $6 RETURNING *',
      [name, description, price, image_url, id, seller_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Product not found or not owned by seller' });
    }

    res.status(200).json({ message: 'Product updated successfully!', product: result.rows[0] });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rute untuk menghapus produk
router.delete('/:id', protect, isSeller, async (req, res) => {
  const { id } = req.params;
  const seller_id = req.user.id;

  try {
    const result = await db.query('DELETE FROM products WHERE id = $1 AND seller_id = $2', [id, seller_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Product not found or not owned by seller' });
    }

    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;