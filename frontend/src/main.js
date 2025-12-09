// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth';
import api from './services/api';
import router from './router';
import App from './App.vue';

// Global stiller: önce tema, sonra varsa ekstra stil
import './assets/styles/variables.css';
import './style.css';

// Font Awesome ikon kütüphanesini dahil ediyoruz
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App);

// 1. Pinia & router’ı kaydet
app.use(createPinia());
app.use(router);

// 2. Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err);
  console.error('Error Info:', info);
  // TODO: Send to error tracking service (e.g., Sentry)
};

// 3. Router hazır olduğunda mount et
router.isReady().then(() => {
  app.mount('#app');
});
