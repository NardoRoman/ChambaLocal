<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in relative">
    <div class="absolute top-10 right-10 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl -z-10"></div>
    
    <div class="flex items-center gap-4 mb-10">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-500/30">
        {{ authStore.user?.name.charAt(0).toUpperCase() }}
      </div>
      <div>
        <h1 class="text-3xl font-extrabold">Hola, {{ authStore.user?.name }}</h1>
        <p class="text-slate-500 dark:text-slate-400">Panel de Control &middot; Modó: <span class="font-semibold text-primary-500">{{ authStore.role }}</span></p>
      </div>
    </div>

    <!-- VISTA CONTRATANTE -->
    <div v-if="authStore.role === 'Contratante'" class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="glass-panel p-6 rounded-2xl animate-slide-up hover:-translate-y-1 transition-transform">
          <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Publicar Trabajo Uregente</h3>
          <p class="text-sm text-slate-500 mb-4">Encuentra a alguien en los próximos 15 minutos cercanos a ti.</p>
          <button class="w-full bg-primary-500 text-white font-medium py-2 rounded-xl shadow cursor-not-allowed opacity-80">Próximamente...</button>
        </div>
        <div class="glass-panel p-6 rounded-2xl animate-slide-up" style="animation-delay: 0.1s">
          <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Mis Publicaciones</h3>
          <div class="text-3xl font-extrabold text-accent-500">0</div>
          <p class="text-sm text-slate-500 mt-1">Trabajos activos</p>
        </div>
        <div class="glass-panel p-6 rounded-2xl animate-slide-up" style="animation-delay: 0.2s">
          <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Gastos del Mes</h3>
          <div class="text-3xl font-extrabold text-slate-800 dark:text-white">$0.00</div>
          <p class="text-sm text-slate-500 mt-1">Acumulado</p>
        </div>
      </div>
      
      <div class="glass-panel p-8 rounded-2xl">
        <h2 class="text-xl font-bold mb-4">Historial de Trabajos</h2>
        <div class="p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
          <p class="text-slate-500">Aún no has publicado ningún trabajo.</p>
        </div>
      </div>
    </div>

    <!-- VISTA TRABAJADOR -->
    <div v-else class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="glass-panel p-6 rounded-2xl animate-slide-up bg-gradient-to-br from-accent-500/10 to-transparent border-accent-500/20">
          <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Mi Rating</h3>
          <div class="flex items-center gap-2">
            <span class="text-3xl font-extrabold text-yellow-500">NaN</span>
            <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          </div>
          <p class="text-sm text-slate-500 mt-1">Basado en reseñas locales.</p>
        </div>
        <div class="glass-panel p-6 rounded-2xl animate-slide-up" style="animation-delay: 0.1s">
          <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Ingresos</h3>
          <div class="text-3xl font-extrabold text-primary-500">$0.00</div>
          <p class="text-sm text-slate-500 mt-1">Este mes</p>
        </div>
      </div>

      <div class="glass-panel p-8 rounded-2xl">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">Oportunidades Cercanas</h2>
          <router-link to="/map" class="text-primary-500 hover:text-primary-600 font-medium text-sm">Ver en mapa &rarr;</router-link>
        </div>
        <div class="p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
          <p class="text-slate-500">Utiliza el explorador de mapas para encontrar trabajos que apliquen a tus habilidades.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth.store';

const authStore = useAuthStore();
</script>
