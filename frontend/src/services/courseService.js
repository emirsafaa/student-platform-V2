// src/services/courseService.js
import api from './api';

// 🎯 Tüm kursları getir – opsiyonel filtre destekler (örn. { grade: 2, term: 'güz' })
export const fetchCourses = (params = {}) =>
  api.get('/courses', { params }).then(({ data }) => data.courses || data);

// 🆕 Yeni kurs oluştur (multipart/form-data ile)
export const createCourse = (payload) =>
  api.post('/courses', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(({ data }) => data.course || data);

// ✏️ Mevcut kursu güncelle (multipart/form-data ile)
export const updateCourse = (id, payload) =>
  api.put(`/courses/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(({ data }) => data.course || data);

// 🗑️ Kursu sil
export const removeCourse = (id) =>
  api.delete(`/courses/${id}`).then(({ data }) => data.message);
