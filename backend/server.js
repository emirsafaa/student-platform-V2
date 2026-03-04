// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');

dotenv.config();

const app = express();

// Güvenlik başlıkları
app.use(helmet());

// Loglama
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('common'));
}

// CORS yapılandırması
const fallbackOrigins = [
  'http://localhost:5173',
  'https://student-platform-frontend.onrender.com'
];
const allowedOrigins = (process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : fallbackOrigins
);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// JSON veriyi parse et
app.use(express.json());

// ✅ Uploads klasörü otomatik oluşturulsun
const uploadDirs = ['uploads', 'uploads/images', 'uploads/pdfs'];
uploadDirs.forEach((dir) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Statik klasör tanımı (görsel ve PDF'lere erişim için)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route'lar
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/qas', require('./routes/qaRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/files', require('./routes/uploadRoutes'));

// Sağlık kontrolü ve varsayılan yanıt
app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/', (req, res) => res.send('🎯 API çalışıyor'));

// 404 yakalayıcı
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint bulunamadı' });
});

// Hata yönetimi
app.use(require('./middleware/errorMiddleware').errorHandler);

// MongoDB bağlantısı ve server başlatma
if (require.main === module) {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('⚠️ MONGO_URI tanımlı değil!');
    process.exit(1);
  }

  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('✅ MongoDB bağlantısı başarılı');
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () =>
        console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`)
      );
    })
    .catch((err) => {
      console.error('❌ MongoDB bağlantı hatası:', err.message);
      process.exit(1);
    });
}

module.exports = app;
