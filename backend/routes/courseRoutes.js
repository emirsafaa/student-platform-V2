// backend/routes/courseRoutes.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { courseUpload } = require('../middleware/upload'); // 🆕 upload middleware

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Public: list courses
router.get('/', courseController.getCourses);

// Admin: create course
router.post(
  '/',
  protect,
  adminOnly,
  courseUpload, // 🆕 PDF ve görsel dosya desteği
  [
    body('title').notEmpty().withMessage('Ders başlığı boş bırakılamaz'),
    body('description')
      .isLength({ min: 10 })
      .withMessage('Açıklama en az 10 karakter olmalı'),
    body('grade')
      .isInt({ min: 1, max: 4 })
      .withMessage('Sınıf 1 ile 4 arasında olmalı'),
    body('term')
      .notEmpty()
      .isIn(['güz', 'bahar'])
      .withMessage('Dönem güz veya bahar olmalıdır'),
    body('year')
      .isInt({ min: 2020, max: 2100 })
      .withMessage('Geçerli bir yıl girilmelidir'),
  ],
  validate,
  courseController.createCourse
);

// Admin: update course
router.put(
  '/:id',
  protect,
  adminOnly,
  courseUpload, // 🆕 PDF ve görsel dosya desteği
  [
    body('title')
      .optional()
      .notEmpty()
      .withMessage('Ders başlığı boş bırakılamaz'),
    body('description')
      .optional()
      .isLength({ min: 10 })
      .withMessage('Açıklama en az 10 karakter olmalı'),
    body('grade')
      .optional()
      .isInt({ min: 1, max: 4 })
      .withMessage('Sınıf 1 ile 4 arasında olmalı'),
  ],
  validate,
  courseController.updateCourse
);

// Admin: delete course
router.delete('/:id', protect, adminOnly, courseController.deleteCourse);

module.exports = router;
