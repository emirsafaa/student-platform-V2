// backend/middleware/upload.js

const multer = require('multer');
const path = require('path');

// 📁 Dosyaların kaydedileceği klasör
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, 'uploads/images');
    } else if (file.mimetype === 'application/pdf') {
      cb(null, 'uploads/pdfs');
    } else {
      cb(new Error('Desteklenmeyen dosya türü'), false);
    }
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// 🔒 Dosya filtreleme
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Yalnızca resim ve PDF dosyalarına izin verilir'), false);
  }
};

// 🧠 Maksimum dosya sayısı ve boyutu
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  }
});

// Çoklu alanlar için export
const courseUpload = upload.fields([
  { name: 'images', maxCount: 3 },
  { name: 'pdfs', maxCount: 10 }
]);

module.exports = { courseUpload };
