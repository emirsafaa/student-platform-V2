<template>
  <div class="dashboard-page">
    <div class="dashboard-wrapper">
      <!-- Sol tarafta sabit yan menü -->
      <aside class="sidebar">
        <router-link to="/announcements" class="sidebar-link"
          >📰 Duyurular</router-link
        >
        <router-link to="/courses" class="sidebar-link">📚 Dersler</router-link>
        <router-link to="/qas" class="sidebar-link">❓ Soru-Cevap</router-link>
      </aside>

      <!-- Sağ ana içerik -->
      <main class="dashboard-content">
        <!-- 1) En üstte Son Duyurular -->
        <section class="section announcements-section">
          <h3>📰 Son Duyurular</h3>
          <div v-if="isLoading" class="loading">Yükleniyor...</div>
          <ul v-else-if="latestAnnouncements.length" class="list">
            <li
              v-for="ann in latestAnnouncements"
              :key="ann._id"
              class="list-item clickable"
              @click="goToAnnouncements"
            >
              <strong>{{ ann.title }}</strong>
              <p class="desc">{{ snippet(ann.content) }}</p>
              <small class="meta">{{ formatDate(ann.createdAt) }}</small>
            </li>
          </ul>
          <p v-else><em>Henüz duyuru yok.</em></p>
        </section>

        <!-- 2) En Son Eklenen Dersler -->
        <section class="section courses-section">
          <h3>📚 En Son Eklenen Dersler</h3>
          <div v-if="isLoading" class="loading">Yükleniyor...</div>
          <ul v-else-if="latestCourses.length" class="list">
            <li
              v-for="course in latestCourses"
              :key="course._id"
              class="list-item clickable"
              @click="goToCourse(course._id)"
            >
              <strong>{{ course.title }}</strong> – {{ course.grade }}. Sınıf
              <p v-if="course.description" class="desc">
                {{ course.description.slice(0, 80) }}…
              </p>
            </li>
          </ul>
          <p v-else><em>Henüz ders yok.</em></p>
        </section>

        <!-- 3) Son Sorular -->
        <section class="section qas-section">
          <h3>❓ Son Sorular</h3>
          <div v-if="isLoading" class="loading">Yükleniyor...</div>
          <ul v-else-if="latestQAs.length" class="list">
            <li
              v-for="qa in latestQAs"
              :key="qa._id"
              class="list-item clickable"
              @click="goToQAs"
            >
              <strong>{{ qa.question }}</strong>
              <p class="meta">
                Ekleyen: {{ qa.createdBy?.username || 'Bilinmiyor' }}
              </p>
            </li>
          </ul>
          <p v-else><em>Henüz soru yok.</em></p>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchCourses } from '@/services/courseService';
import { fetchQAs } from '@/services/qaService';
import { fetchAnnouncements } from '@/services/announcementService';

const LATEST_ITEMS_COUNT = 3; // Constant for latest items display

const router = useRouter();
const user = { role: localStorage.getItem('role') };

const isLoading = ref(true);
const latestAnnouncements = ref([]);
const latestCourses = ref([]);
const latestQAs = ref([]);

onMounted(async () => {
  isLoading.value = true;
  try {
    // Duyurular
    const annRes = await fetchAnnouncements();
    const allAnns = annRes.announcements || annRes;
    latestAnnouncements.value = allAnns
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, LATEST_ITEMS_COUNT);

    // Dersler
    const courseRes = await fetchCourses();
    const allCourses = courseRes.courses || courseRes;
    latestCourses.value = allCourses.slice(-LATEST_ITEMS_COUNT).reverse();

    // Sorular
    const qaRes = await fetchQAs();
    const allQAs = qaRes.qaList || qaRes;
    latestQAs.value = allQAs.slice(-LATEST_ITEMS_COUNT).reverse();
  } catch (err) {
    console.error('Dashboard verisi yüklenemedi:', err);
  } finally {
    isLoading.value = false;
  }
});

// Yönlendirme
const goToAnnouncements = () => router.push('/announcements');
const goToCourse = (id) => {
  localStorage.setItem('selectedCourseId', id);
  router.push('/courses');
};
const goToQAs = () => router.push('/qas');

// İçerikten kısa önizleme
const snippet = (md) => {
  const text = md.replace(/[#_*>[\]()`-]/g, '').trim();
  return text.length > 80 ? text.slice(0, 80) + '…' : text;
};
const formatDate = (str) =>
  new Date(str).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  min-height: calc(100vh - var(--navbar-height));
}
.sidebar {
  width: 200px;
  background: var(--color-card-bg);
  border-right: 1px solid var(--color-border);
  padding: var(--spacing);
}
.sidebar-link {
  display: block;
  margin-bottom: 1rem;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
}
.sidebar-link:hover {
  color: var(--color-secondary);
}

.dashboard-content {
  flex: 1;
  padding: var(--spacing);
}
.section {
  margin-bottom: 2rem;
}
.list {
  list-style: none;
  padding: 0;
}
.list-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}
.list-item strong {
  color: var(--color-primary);
}
.desc {
  display: block;
  font-size: 0.9rem;
  color: var(--color-muted);
}
.meta {
  font-size: 0.8rem;
  color: var(--color-muted);
  margin-top: 0.25rem;
}
.clickable {
  cursor: pointer;
  transition: background-color var(--transition-fast);
}
.clickable:hover {
  background-color: #f0f0f0;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-muted);
  font-style: italic;
}

@media (max-width: 900px) {
  .dashboard-wrapper {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }
}
</style>
