// controllers/authController.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

// Helper: JWT üretir
const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

exports.register = asyncHandler(async (req, res) => {
  // 1) validationResult
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    throw new Error(errors.array().map(e => e.msg).join(', '));
  }

  // 2) body'den sadece username/email/password al
  const { username, email, password } = req.body;

  // 3) kullanıcı zaten var mı?
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error('Bu e-posta zaten kayıtlı.');
  }

  // 4) Şifre hash işlemi User schema'daki pre hook ile yapılacak

  // 5) Kullanıcı oluştur, role sabit 'user'
  const user = new User({
    username,
    email,
    password,
    role: 'user',
  });

  try {
    await user.save();
  } catch (err) {
    // E11000 duplicate key error handling
    if (err.code === 11000) {
      res.status(409);
      throw new Error('Bu kullanıcı adı veya e-posta zaten kullanımda.');
    }
    throw err;
  }

  // 6) token üret
  const token = generateToken(user._id);

  // 7) yanıt: token + user objesi
  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

exports.login = asyncHandler(async (req, res) => {
  // 1) validationResult
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    throw new Error(errors.array().map(e => e.msg).join(', '));
  }

  // 2) body'den email/password al
  const { email, password } = req.body;

  // 3) kullanıcıyı bul (silinmiş kullanıcıları hariç tut)
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) {
    res.status(401);
    throw new Error('Geçersiz kimlik bilgisi.');
  }

  // 4) şifre kontrolü
  const match = await user.comparePassword(password);
  if (!match) {
    res.status(401);
    throw new Error('Geçersiz kimlik bilgisi.');
  }

  // 5) token üret
  const token = generateToken(user._id);

  // 6) yanıt
  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});
