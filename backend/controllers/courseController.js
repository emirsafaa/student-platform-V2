const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');

// Create a new course (admin only)
exports.createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    grade,
    term,
    year,
    youtubeEmbed,
    youtubePlaylist,
  } = req.body;

  // Çoklu dosyalar kontrolü
  const images = Array.isArray(req.files?.images)
    ? req.files.images.map(file => `/uploads/images/${file.filename}`)
    : req.files?.images
      ? [`/uploads/images/${req.files.images.filename}`]
      : [];

  const pdfs = Array.isArray(req.files?.pdfs)
    ? req.files.pdfs.map(file => `/uploads/pdfs/${file.filename}`)
    : req.files?.pdfs
      ? [`/uploads/pdfs/${req.files.pdfs.filename}`]
      : [];

  const newCourse = new Course({
    title,
    description,
    grade,
    term,
    year,
    youtubeEmbed,
    youtubePlaylist,
    images,
    pdfs,
    createdBy: req.user._id,
  });

  const savedCourse = await newCourse.save();
  res.status(201).json({ success: true, course: savedCourse });
});

// Get courses (with optional search)
exports.getCourses = asyncHandler(async (req, res) => {
  const { search } = req.query;

  const query = { isDeleted: false };

  if (search && typeof search === 'string') {
    query.title = { $regex: search, $options: 'i' }; // case-insensitive
  }

  const courses = await Course.find(query);
  res.status(200).json({ success: true, courses });
});

// Update course (admin only)
exports.updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course)
    return res.status(404).json({ success: false, message: 'Ders bulunamadı.' });

  const {
    title,
    description,
    grade,
    term,
    year,
    youtubeEmbed,
    youtubePlaylist,
  } = req.body;

  // Yeni dosyalar yüklenmişse mevcutlara ekle (veya üzerine yaz)
  // Mevcut uygulama Create'te nasılsa öyle yapalım
  let updatedImages = course.images;
  if (req.files?.images) {
    const newImages = Array.isArray(req.files.images)
      ? req.files.images.map(file => `/uploads/images/${file.filename}`)
      : [`/uploads/images/${req.files.images.filename}`];

    updatedImages = [...updatedImages, ...newImages];
  }

  let updatedPdfs = course.pdfs;
  if (req.files?.pdfs) {
    const newPdfs = Array.isArray(req.files.pdfs)
      ? req.files.pdfs.map(file => `/uploads/pdfs/${file.filename}`)
      : [`/uploads/pdfs/${req.files.pdfs.filename}`];

    updatedPdfs = [...updatedPdfs, ...newPdfs];
  }

  const updated = await Course.findByIdAndUpdate(
    req.params.id,
    {
      title: title || course.title,
      description: description || course.description,
      grade: grade || course.grade,
      term: term || course.term,
      year: year || course.year,
      youtubeEmbed: youtubeEmbed !== undefined ? youtubeEmbed : course.youtubeEmbed,
      youtubePlaylist: youtubePlaylist !== undefined ? youtubePlaylist : course.youtubePlaylist,
      images: updatedImages,
      pdfs: updatedPdfs
    },
    { new: true }
  );

  res.status(200).json({ success: true, course: updated });
});

// Soft delete course (admin only)
exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course)
    return res.status(404).json({ success: false, message: 'Ders bulunamadı.' });

  await Course.findByIdAndUpdate(req.params.id, { isDeleted: true });

  res.status(200).json({
    success: true,
    message: 'Ders başarıyla silindi (soft delete).',
  });
});
