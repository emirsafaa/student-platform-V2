// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Note: Register, Login, and Profile functions are in authController.js

// Get all users (admin only)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ success: true, users });
});

// Get user by ID (any authenticated user)
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: 'Kullanıcı bulunamadı.' });
  }
  res.json({ success: true, user });
});

// Update user profile (any authenticated user)
exports.updateUser = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  // 🔒 GÜVENLİK KONTROLÜ: Sadece kendi profilini veya admin yetkisiyle güncelleyebilir
  if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Başkasına ait profili güncelleme yetkiniz yok.',
    });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: 'Kullanıcı bulunamadı.' });
  }
  if (username) user.username = username;
  if (email) user.email = email;
  await user.save();
  res.json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

// Delete user (admin only)
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: 'Kullanıcı bulunamadı.' });
  }
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Kullanıcı başarıyla silindi.' });
});

// Update user role (user ↔ admin) (admin only)
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body; // 'user' veya 'admin'

  // Role validation
  if (!role || !['user', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz rol. Sadece "user" veya "admin" olabilir.',
    });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: 'Kullanıcı bulunamadı.' });
  }
  user.role = role;
  await user.save();
  res.json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});
