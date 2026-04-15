<template>
  <div class="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
    <Navbar @toggle-theme="toggleTheme" :isDarkMode="isDarkMode" />
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="py-8 text-center text-sm text-slate-500 dark:text-slate-400 glass border-t border-slate-200 dark:border-slate-800 mt-auto">
      <p>&copy; 2026 ChambaLocal. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from './store/auth.store';
import Navbar from './components/Navbar.vue';

const isDarkMode = ref(false);
const authStore = useAuthStore();

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

onMounted(async () => {
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  await authStore.loadUser();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
