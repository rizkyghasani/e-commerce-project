const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Mendapatkan token dari header
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Menyimpan informasi user ke dalam request
      req.user = decoded;

      // Lanjut ke endpoint
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const isSeller = (req, res, next) => {
    if (req.user && req.user.role === 'seller') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a seller' });
    }
};

module.exports = { protect, isSeller };