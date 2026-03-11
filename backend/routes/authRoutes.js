const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// Rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Çok fazla deneme yaptınız. Lütfen 15 dakika sonra tekrar deneyin.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Register
router.post(
  '/register',
  authLimiter, // Apply rate limiting
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Kullanıcı adı 3–30 karakter olmalı'),
    body('email')
      .isEmail()
      .withMessage('Geçerli bir email adresi giriniz')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Parola en az 8 karakter olmalı')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        'Parola en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'
      ),
  ],
  register
);

// Login
router.post(
  '/login',
  authLimiter, // Apply rate limiting
  [
    body('email')
      .isEmail()
      .withMessage('Geçerli bir email adresi giriniz')
      .normalizeEmail(),
    body('password').notEmpty().withMessage('Parola alanı boş bırakılamaz'),
  ],
  login
);

module.exports = router;
