const request = require('supertest');
const { app, server } = require('../server'); // Mengimpor app dan server
const db = require('../db');

// Mengatur database testing sebelum semua tes dijalankan
beforeAll(async () => {
  // Hapus data dari tabel products terlebih dahulu karena foreign key
  await db.query('DELETE FROM products');
  // Baru hapus data dari tabel users
  await db.query('DELETE FROM users');
});

// Menutup server dan koneksi database setelah semua tes selesai
afterAll(async () => {
  if (server) {
    server.close();
  }
  await db.pool.end();
});

describe('Auth API', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'buyer',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should not register a user with an existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User 2',
        email: 'test@example.com',
        password: 'password456',
        role: 'seller',
      });
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('message', 'Email already exists');
  });

  it('should login an existing user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should not login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});