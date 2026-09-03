import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import 'vue-sonner/style.css';
import './style.css';

const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (response.status === 401) {
    const isLoginEndpoint = typeof args[0] === 'string' && args[0].includes('/auth/admin/login');
    if (!isLoginEndpoint) {
      const authStore = useAuthStore();
      if (authStore.isAuthenticated) {
        authStore.logout();
        const currentPath = router.currentRoute.value.fullPath;
        router.push({
          name: 'login',
          query: currentPath && currentPath !== '/' && currentPath !== '/login' ? { redirect: currentPath } : undefined,
        });
      }
    }
  }
  return response;
};

const app = createApp(App);
app.use(createPinia());
app.use(router);

app.mount('#app');

