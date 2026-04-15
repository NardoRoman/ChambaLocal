<template>
  <header class="sticky top-0 z-50 glass w-full transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="text-2xl font-bold tracking-tight text-gradient flex items-center gap-2">
            <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            ChambaLocal
          </router-link>
        </div>

        <!-- Desktop Menu -->
        <nav class="hidden md:flex space-x-8 items-center">
          <router-link to="/map" class="text-slate-600 dark:text-slate-300 hover:text-primary-500 font-medium transition-colors">Mapa Explorer</router-link>
          
          <template v-if="authStore.isAuthenticated">
            <router-link to="/dashboard" class="text-slate-600 dark:text-slate-300 hover:text-primary-500 font-medium transition-colors">Dashboard</router-link>
            <div class="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <span class="text-sm font-semibold text-slate-800 dark:text-white">{{ authStore.user?.name }}</span>
              <span class="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">{{ authStore.role }}</span>
              <button @click="logout" class="text-sm text-red-500 hover:text-red-700 ml-2 transition-colors">Salir</button>
            </div>
          </template>
          
          <template v-else>
            <router-link to="/login" class="text-slate-600 dark:text-slate-300 hover:text-primary-500 font-medium transition-colors">Ingresar</router-link>
            <router-link to="/register" class="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-5 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all transform hover:-translate-y-0.5">Regístrate</router-link>
          </template>

          <button @click="$emit('toggle-theme')" class="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
            <svg v-if="!isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </button>
        </nav>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center space-x-2">
          <button @click="$emit('toggle-theme')" class="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
            <svg v-if="!isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </button>
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-2 focus:outline-none">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Backdrop -->
    <transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="md:hidden fixed inset-0 top-16 bg-slate-900/60 backdrop-blur-sm z-40"></div>
    </transition>

    <!-- Mobile Dropdown Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 absolute w-full top-16 left-0 shadow-2xl overflow-hidden py-4 z-50">
        <nav class="flex flex-col px-4 space-y-4">
          <router-link @click="isMobileMenuOpen = false" to="/map" class="block px-4 py-3 rounded-lg text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">Mapa Explorer</router-link>
          
          <template v-if="authStore.isAuthenticated">
            <router-link @click="isMobileMenuOpen = false" to="/dashboard" class="block px-4 py-3 rounded-lg text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">Dashboard</router-link>
            <div class="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl mt-2 flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-slate-800 dark:text-white">{{ authStore.user?.name }}</span>
                <span class="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">{{ authStore.role }}</span>
              </div>
              <button @click="logout(); isMobileMenuOpen = false" class="text-sm text-red-500 font-bold self-start mt-2">Cerrar Sesión</button>
            </div>
          </template>
          
          <template v-else>
            <router-link @click="isMobileMenuOpen = false" to="/login" class="block px-4 py-3 rounded-lg text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">Ingresar</router-link>
            <router-link @click="isMobileMenuOpen = false" to="/register" class="block px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-bold text-center mt-2">Regístrate Gratis</router-link>
          </template>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth.store';
import { useRouter } from 'vue-router';

defineProps({
  isDarkMode: Boolean
});

const authStore = useAuthStore();
const router = useRouter();
const isMobileMenuOpen = ref(false);

const logout = () => {
  authStore.logout();
  router.push('/');
}
</script>
