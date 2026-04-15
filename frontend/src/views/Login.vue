<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
    <!-- Decoraciones de fondo abstractas -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl"></div>

    <div class="w-full max-w-md p-8 glass-panel rounded-2xl relative z-10 animate-fade-in">
      <h2 class="text-3xl font-extrabold text-center mb-6">Iniciar Sesión</h2>
      <p class="text-center text-slate-500 mb-8">Ingresa a ChambaLocal para conectar con tu comunidad.</p>
      
      <!-- Selección de Rol -->
      <div class="flex p-1 bg-slate-200 dark:bg-slate-700/50 rounded-xl mb-8">
        <button 
          @click="selectedRole = 'Contratante'"
          :class="selectedRole === 'Contratante' ? 'bg-white dark:bg-slate-800 shadow text-primary-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
          class="flex-1 py-2 font-medium rounded-lg transition-all"
        >
          Quiero Contratar
        </button>
        <button 
          @click="selectedRole = 'Trabajador'"
          :class="selectedRole === 'Trabajador' ? 'bg-white dark:bg-slate-800 shadow text-accent-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
          class="flex-1 py-2 font-medium rounded-lg transition-all"
        >
          Soy Trabajador
        </button>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5 flex flex-col">
        <div>
          <label class="block text-sm font-medium mb-1 dark:text-slate-300">Correo Electrónico</label>
          <input v-model="email" type="email" required class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="tucorreo@ejemplo.com" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1 dark:text-slate-300">Contraseña</label>
          <input v-model="password" type="password" required class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="••••••••" />
        </div>

        <div v-if="errorMsg" class="text-red-500 text-sm text-center font-medium">{{ errorMsg }}</div>

        <button :disabled="authStore.loading" type="submit" class="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-primary-600 to-accent-600 hover:opacity-90 transform hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-primary-500/25 flex justify-center items-center">
          <span v-if="authStore.loading" class="animate-pulse">Ingresando...</span>
          <span v-else>Entrar como {{ selectedRole }}</span>
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        ¿Aún no tienes cuenta? 
        <router-link to="/register" class="font-semibold text-primary-600 hover:text-primary-500">Regístrate</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth.store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const selectedRole = ref('Contratante');
const email = ref('');
const password = ref('');
const errorMsg = ref('');

const handleLogin = async () => {
  try {
    errorMsg.value = '';
    await authStore.login(email.value, password.value, selectedRole.value);
    router.push('/dashboard');
  } catch (err) {
    errorMsg.value = err;
  }
};
</script>
