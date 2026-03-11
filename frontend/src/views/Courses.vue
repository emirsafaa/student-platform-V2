<template>
  <div class="courses-view-container">
    <!-- Arama Kutusu -->
    <input
      v-model="searchQuery"
      @input="filterCourses"
      type="text"
      placeholder="Ders ara..."
      class="course-search"
    />

    <!-- Admin Form -->
    <div v-if="isAdmin" class="admin-form">
      <button class="btn-add-course" @click="openForm">
        {{ editingId ? 'Düzenleme Modu' : 'Yeni Ders Ekle' }}
      </button>
      <div v-if="showForm" class="form">
        <input v-model="form.title" placeholder="Ders Başlığı" required />
        <textarea
          v-model="form.description"
          placeholder="Açıklama (Markdown destekli)"
          rows="4"
          required
        ></textarea>
        <input
          type="number"
          v-model="form.year"
          placeholder="Yıl (örneğin 2025)"
          required
        />
        <select v-model="form.grade" required>
          <option disabled value="">— Sınıf Seçin —</option>
          <option v-for="g in grades" :key="g" :value="g">
            {{ g }}. Sınıf
          </option>
        </select>
        <select v-model="form.term" required>
          <option disabled value="">— Dönem Seçin —</option>
          <option value="güz">Güz</option>
          <option value="bahar">Bahar</option>
        </select>

        <!-- Dosya yüklemeleri -->
        <div>
          <label>Görseller (max 3):</label>
          <input
            type="file"
            accept="image/*"
            multiple
            @change="handleImageUpload"
          />
        </div>
        <div>
          <label>PDF'ler (max 10):</label>
          <input
            type="file"
            accept="application/pdf"
            multiple
            @change="handlePDFUpload"
          />
        </div>

        <!-- YouTube Alanları -->
        <input v-model="form.youtubeEmbed" placeholder="YouTube Embed Linki" />
        <input
          v-model="form.youtubePlaylist"
          placeholder="YouTube Playlist Linki"
        />

        <div class="form-buttons">
          <button class="btn-add-course" @click="saveCourse">Kaydet</button>
          <button class="btn-cancel" @click="cancelForm">İptal</button>
        </div>
      </div>
    </div>

    <!-- Ders Detay (Overlay) -->
    <div v-if="selectedCourse" class="course-detail-overlay">
      <button class="back-btn" @click="selectedCourse = null">‹ Geri</button>
      <h3>{{ selectedCourse.title }}</h3>
      <div
        class="course-description"
        v-html="renderMarkdown(selectedCourse.description)"
      ></div>

      <div v-if="selectedCourse.images?.length">
        <h4>Görseller</h4>
        <div class="image-gallery">
          <img
            v-for="img in selectedCourse.images"
            :key="img"
            :src="baseURL + img"
            class="course-image"
          />
        </div>
      </div>

      <div v-if="selectedCourse.pdfs?.length">
        <h4>PDF Dokümanlar</h4>
        <ul>
          <li v-for="pdf in selectedCourse.pdfs" :key="pdf">
            <a :href="baseURL + pdf" target="_blank" rel="noopener">{{
              fileName(pdf)
            }}</a>
          </li>
        </ul>
      </div>

      <div v-if="selectedCourse.youtubeEmbed">
        <h4>Video</h4>
        <div class="video-wrapper">
          <iframe
            :src="embedUrl(selectedCourse.youtubeEmbed)"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <div v-if="selectedCourse.youtubePlaylist">
        <h4>YouTube Oynatma Listesi</h4>
        <a :href="selectedCourse.youtubePlaylist" target="_blank" rel="noopener"
          >Listeyi Aç</a
        >
      </div>

      <!-- ✅ Admin Düzenle/Sil Butonları -->
      <div v-if="isAdmin" class="admin-actions">
        <button @click="enterEditMode(selectedCourse)">Düzenle</button>
        <button @click="deleteCourse(selectedCourse._id)">Sil</button>
      </div>
    </div>

    <!-- Kurs Görüntüleme -->
    <div v-else class="grade-panels">
      <div v-for="grade in grades" :key="grade" class="grade-panel">
        <h3>{{ grade }}. Sınıf</h3>

        <div class="term-panel">
          <h4>Güz Dönemi</h4>
          <div v-if="filteredCoursesByGradeAndTerm(grade, 'güz').length">
            <div
              v-for="c in filteredCoursesByGradeAndTerm(grade, 'güz')"
              :key="c._id"
              class="course-card"
            >
              <button @click="selectCourse(c)">{{ c.title }}</button>
              <span v-if="isAdmin" class="list-actions">
                <button @click.stop="enterEditMode(c)">✎</button>
                <button @click.stop="deleteCourse(c._id)">🗑</button>
              </span>
            </div>
          </div>
          <em v-else>Henüz ders yok.</em>
        </div>

        <div class="term-panel">
          <h4>Bahar Dönemi</h4>
          <div v-if="filteredCoursesByGradeAndTerm(grade, 'bahar').length">
            <div
              v-for="c in filteredCoursesByGradeAndTerm(grade, 'bahar')"
              :key="c._id"
              class="course-card"
            >
              <button @click="selectCourse(c)">{{ c.title }}</button>
              <span v-if="isAdmin" class="list-actions">
                <button @click.stop="enterEditMode(c)">✎</button>
                <button @click.stop="deleteCourse(c._id)">🗑</button>
              </span>
            </div>
          </div>
          <em v-else>Henüz ders yok.</em>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import {
  fetchCourses,
  createCourse,
  updateCourse,
  removeCourse,
} from '../services/courseService';
import { baseURL } from '../services/api';

const isAdmin = computed(() => localStorage.getItem('role') === 'admin');
const grades = [1, 2, 3, 4];
const courses = ref([]);
const selectedCourse = ref(null);
const showForm = ref(false);
const editingId = ref(null);
const searchQuery = ref('');
const filteredCourses = ref([]);

// baseURL is now imported from api.js

const form = ref({
  title: '',
  description: '',
  grade: null,
  term: '',
  year: new Date().getFullYear(),
  youtubeEmbed: '',
  youtubePlaylist: '',
});

const images = ref([]);
const pdfs = ref([]);

function handleImageUpload(e) {
  images.value = Array.from(e.target.files).slice(0, 3);
}
function handlePDFUpload(e) {
  pdfs.value = Array.from(e.target.files).slice(0, 10);
}

async function load() {
  const res = await fetchCourses();
  courses.value = res.courses || res;
  filteredCourses.value = [...courses.value];
}
onMounted(load);

function filterCourses() {
  const query = searchQuery.value.toLowerCase();
  filteredCourses.value = courses.value.filter((course) =>
    course.title.toLowerCase().includes(query)
  );
}

const filteredCoursesByGradeAndTerm = (g, t) =>
  filteredCourses.value.filter((c) => Number(c.grade) === g && c.term === t);

const fileName = (url) => url.split('/').pop();
const embedUrl = (url) => {
  const m = url.match(/(?:v=|\.be\/|embed\/)([^&?]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
};
const renderMarkdown = (text) => DOMPurify.sanitize(marked.parse(text || ''));

function selectCourse(c) {
  selectedCourse.value = c;
}
function openForm() {
  showForm.value = true;
  if (editingId.value) {
    Object.assign(form.value, selectedCourse.value);
  } else {
    Object.assign(form.value, {
      title: '',
      description: '',
      grade: null,
      term: '',
      year: new Date().getFullYear(),
      youtubeEmbed: '',
      youtubePlaylist: '',
    });
    images.value = [];
    pdfs.value = [];
  }
}
function cancelForm() {
  showForm.value = false;
  editingId.value = null;
}
async function saveCourse() {
  try {
    const payload = new FormData();
    for (const [key, value] of Object.entries(form.value)) {
      payload.append(key, value);
    }
    images.value.forEach((file) => payload.append('images', file));
    pdfs.value.forEach((file) => payload.append('pdfs', file));

    if (editingId.value) {
      await updateCourse(editingId.value, payload);
    } else {
      await createCourse(payload);
    }
    cancelForm();
    selectedCourse.value = null;
    await load();
  } catch (err) {
    alert(err.message || 'Kayıt sırasında hata oluştu.');
  }
}
function enterEditMode(c) {
  selectedCourse.value = c || selectedCourse.value;
  editingId.value = (c || selectedCourse.value)._id;
  openForm();
}
async function deleteCourse(id) {
  if (!confirm('Bu dersi silmek istiyor musunuz?')) return;
  await removeCourse(id);
  if (selectedCourse.value?._id === id) {
    selectedCourse.value = null;
  }
  await load();
}
</script>

<style>
.course-search {
  width: 100%;
  max-width: 400px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 1rem;
}
</style>
