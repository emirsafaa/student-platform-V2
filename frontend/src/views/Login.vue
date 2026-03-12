<!-- src/views/Login.vue -->
<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2 class="auth-title">Giriş Yap</h2>
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="mail@ornek.com"
          />
        </div>
        <div class="form-group">
          <label for="password">Şifre</label>
          <div class="password-input-wrapper">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="••••••••"
            />
            <button
              type="button"
              class="toggle-password-btn"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <button class="auth-button" :disabled="loading">
          {{ loading ? 'Bekleyin...' : 'Giriş Yap' }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
      <div class="auth-links">
        <router-link to="/register">Kayıt Ol</router-link>
        <span class="separator">|</span>
        <router-link to="/">← Anasayfa</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const showPassword = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    // Rol bazlı yönlendirme
    const role = authStore.user?.role;
    router.push(role === 'admin' ? '/dashboard' : '/qas');
  } catch (err) {
    error.value = err.message || 'Giriş başarısız. Bilgileri kontrol edin.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px); /* Navbar yüksekliği kadar boşluk bırak */
  background-color: #f5f7fa;
  padding: 1rem;
}

.auth-card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.auth-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  color: #333333;
}

.auth-form .form-group {
  margin-bottom: 1rem;
}

.auth-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555555;
  font-size: 0.9rem;
}

.auth-form input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 1rem;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  padding-right: 2.5rem;
}

.toggle-password-btn {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: #888888;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.toggle-password-btn:hover {
  color: #333333;
}

.toggle-password-btn:focus-visible {
  outline: 2px solid #4f46e5;
  border-radius: 4px;
}

.auth-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.auth-button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin-top: 0.75rem;
  color: #e53e3e;
  text-align: center;
  font-size: 0.9rem;
}

.auth-links {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.auth-links .separator {
  margin: 0 0.5rem;
  color: #888888;
}
</style>
