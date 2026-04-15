<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-8 relative overflow-hidden">
    <div class="absolute top-0 left-0 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl"></div>

    <div class="w-full max-w-md p-8 glass-panel rounded-2xl relative z-10 animate-fade-in">
      <h2 class="text-3xl font-extrabold text-center mb-6">Crear Cuenta</h2>
      
      <div class="flex p-1 bg-slate-200 dark:bg-slate-700/50 rounded-xl mb-6">
        <button 
          @click="selectedRole = 'Contratante'"
          :class="selectedRole === 'Contratante' ? 'bg-white dark:bg-slate-800 shadow text-primary-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
          class="flex-1 py-2 font-medium rounded-lg transition-all"
        >
          Contratar
        </button>
        <button 
          @click="selectedRole = 'Trabajador'"
          :class="selectedRole === 'Trabajador' ? 'bg-white dark:bg-slate-800 shadow text-accent-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
          class="flex-1 py-2 font-medium rounded-lg transition-all"
        >
          Ofrecer Servicio
        </button>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4 flex flex-col">
        <div>
          <label class="block text-sm font-medium mb-1 dark:text-slate-300">Nombre Completo</label>
          <input v-model="form.name" type="text" required class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1 dark:text-slate-300">Correo Electrónico</label>
          <input v-model="form.email" type="email" required class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1 dark:text-slate-300">Contraseña</label>
          <input v-model="form.password" type="password" required class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
        </div>

        <div v-if="selectedRole === 'Trabajador'">
          <label class="block text-sm font-medium mb-1 dark:text-slate-300">Habilidades Principales</label>
          <input v-model="form.skills" type="text" placeholder="Ej: Plomería, Electricidad" class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-accent-500 outline-none transition-all" />
        </div>

        <!-- In app real location mock -->
        <div class="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 p-2 rounded">
          <i class="opacity-70">Ubicación simulada para el MVP: Ciudad Central</i>
        </div>

        <div v-if="errorMsg" class="text-red-500 text-sm text-center font-medium">{{ errorMsg }}</div>

        <button :disabled="authStore.loading" type="submit" class="w-full mt-2 py-3 rounded-xl text-white font-bold bg-gradient-to-r from-primary-600 to-accent-600 hover:opacity-90 transform hover:-translate-y-0.5 transition-all shadow-lg flex justify-center items-center">
          <span v-if="authStore.loading" class="animate-pulse">Creando cuenta...</span>
          <span v-else>Crear Cuenta</span>
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-slate-500">¿Ya tienes cuenta? <router-link to="/login" class="font-semibold text-primary-600 hover:text-primary-500">Inicia sesión</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '../store/auth.store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const selectedRole = ref('Contratante');
const errorMsg = ref('');

const form = reactive({
  name: '',
  email: '',
  password: '',
  skills: ''
});

const handleRegister = async () => {
  try {
    errorMsg.value = '';
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: selectedRole.value,
      longitude: -99.1332, // Example mock coordinates
      latitude: 19.4326
    };

    if (selectedRole.value === 'Trabajador') {
      payload.skills = form.skills.split(',').map(s => s.trim());
    }

    await authStore.register(payload);
    router.push('/dashboard');
  } catch (err) {
    errorMsg.value = err;
  }
};
</script>
