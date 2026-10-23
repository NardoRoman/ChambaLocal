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
          <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Publicar Trabajo Urgente</h3>
          <p class="text-sm text-slate-500 mb-4">Encuentra a alguien en los próximos minutos cercanos a ti.</p>
          <router-link to="/crear-trabajo" class="block text-center w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold py-2 rounded-xl shadow-lg hover:shadow-primary-500/30 transition-shadow">
            Publicar Ahora
          </router-link>
        </div>
        <div class="glass-panel p-6 rounded-2xl animate-slide-up" style="animation-delay: 0.1s">
          <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Mis Publicaciones</h3>
          <div class="text-3xl font-extrabold text-accent-500">{{ jobStore.myJobs.length }}</div>
          <p class="text-sm text-slate-500 mt-1">Trabajos activos</p>
        </div>
        <div class="glass-panel p-6 rounded-2xl animate-slide-up" style="animation-delay: 0.2s">
          <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Gastos del Mes</h3>
          <div class="text-3xl font-extrabold text-slate-800 dark:text-white">${{ totalBudget.toFixed(2) }}</div>
          <p class="text-sm text-slate-500 mt-1">Presupuesto Acumulado</p>
        </div>
      </div>
      
      <div class="glass-panel p-8 rounded-2xl">
        <h2 class="text-xl font-bold mb-4">Historial de Trabajos</h2>
        
        <div v-if="jobStore.loading" class="text-center py-8">
          <svg class="animate-spin mx-auto h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
        
        <div v-else-if="jobStore.myJobs.length === 0" class="p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
          <p class="text-slate-500">Aún no has publicado ningún trabajo.</p>
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="job in jobStore.myJobs" :key="job._id" class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 flex flex-col">
            <div class="flex justify-between items-center cursor-pointer" @click="toggleJob(job._id)">
              <div>
                <h4 class="font-bold text-slate-800 dark:text-white hover:text-primary-500">{{ job.title }}</h4>
                <p class="text-sm text-slate-500">{{ job.category }} - {{ new Date(job.createdAt).toLocaleDateString() }}</p>
              </div>
              <div class="text-right">
                <span class="inline-block px-3 py-1 rounded-full text-xs font-bold" :class="{
                  'bg-green-100 text-green-700': job.status === 'Abierto',
                  'bg-blue-100 text-blue-700': job.status === 'En Progreso',
                  'bg-slate-200 text-slate-700': job.status === 'Completado',
                }">{{ job.status }}</span>
                <p class="text-sm font-semibold mt-1">${{ job.budget || 0 }}</p>
              </div>
            </div>

            <!-- Job Expanded Details -->
            <div v-if="expandedJobId === job._id" class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
              <div v-if="job.status === 'Abierto'">
                <div class="flex justify-between items-center mb-2">
                  <h5 class="text-sm font-bold">Postulantes ({{ job.applicants.length }})</h5>
                  <button @click="openEditModal(job)" class="text-xs font-bold text-primary-500 hover:text-primary-600 underline">Editar Trabajo</button>
                </div>
                <div v-if="job.applicants.length === 0" class="text-xs text-slate-500">Aún no hay postulantes.</div>
                <div v-for="app in job.applicants" :key="app._id" class="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg mb-2 flex justify-between items-center">
                  <div>
                    <p class="font-semibold text-sm">{{ app.user?.name || 'Usuario' }} <span class="text-yellow-500">★ {{ app.user?.averageRating?.toFixed(1) || '0.0' }}</span></p>
                    <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">"{{ app.message || 'Sin mensaje' }}"</p>
                  </div>
                  <button @click="acceptApplicant(job._id, app.user?._id)" class="px-3 py-1 bg-primary-500 text-white rounded text-xs font-bold hover:bg-primary-600">Aceptar</button>
                </div>
              </div>

              <div v-else-if="job.status === 'En Progreso'">
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h5 class="text-sm font-bold text-blue-800 dark:text-blue-300">Trabajador Asignado</h5>
                    <p class="text-sm text-slate-600 dark:text-slate-400">Contactar para confirmar detalles.</p>
                  </div>
                  <button @click="openReviewModal(job)" class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 shadow-lg">Marcar como Completado</button>
                </div>
              </div>
              
              <div v-else-if="job.status === 'Completado'">
                <div v-if="!job.reviewed" class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex justify-between items-center border border-yellow-200 dark:border-yellow-800">
                  <div>
                    <h5 class="text-sm font-bold text-yellow-800 dark:text-yellow-300">Calificación Pendiente</h5>
                    <p class="text-sm text-yellow-700 dark:text-yellow-400">Por favor, califica al trabajador para cerrar el ciclo.</p>
                  </div>
                  <button @click="openReviewModal(job)" class="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-bold hover:bg-yellow-600 shadow-lg">Calificar Trabajador</button>
                </div>
                <div v-else class="text-sm text-slate-500 text-center py-2">
                  Este trabajo ha sido finalizado y el trabajador ha sido calificado.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VISTA TRABAJADOR -->
    <div v-else class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="glass-panel p-6 rounded-2xl animate-slide-up bg-gradient-to-br from-accent-500/10 to-transparent border-accent-500/20">
          <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Mi Rating</h3>
          <div class="flex items-center gap-2">
            <span class="text-3xl font-extrabold text-yellow-500">{{ authStore.user?.averageRating ? authStore.user.averageRating.toFixed(1) : '0.0' }}</span>
            <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          </div>
          <p class="text-sm text-slate-500 mt-1">Basado en reseñas locales.</p>
        </div>
        <div class="glass-panel p-6 rounded-2xl animate-slide-up" style="animation-delay: 0.1s">
          <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Ingresos Estimados</h3>
          <div class="text-3xl font-extrabold text-primary-500">${{ totalWorkerIncome.toFixed(2) }}</div>
          <p class="text-sm text-slate-500 mt-1">De trabajos completados</p>
        </div>
      </div>

      <!-- Mis Postulaciones -->
      <div class="glass-panel p-8 rounded-2xl">
        <h2 class="text-xl font-bold mb-4">Mis Postulaciones</h2>
        <div v-if="jobStore.loading" class="text-center py-4">Cargando...</div>
        <div v-else-if="myApplications.length === 0" class="text-slate-500 text-sm border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center">No te has postulado a ningún trabajo aún.</div>
        <div v-else class="space-y-4">
          <div v-for="job in myApplications" :key="job._id" class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50">
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-bold text-slate-800 dark:text-white">{{ job.title }}</h4>
              <span class="inline-block px-2 py-1 rounded text-xs font-bold" :class="{
                'bg-yellow-100 text-yellow-700': getMyStatus(job) === 'Pendiente',
                'bg-green-100 text-green-700': getMyStatus(job) === 'Aceptado',
                'bg-red-100 text-red-700': getMyStatus(job) === 'Rechazado'
              }">{{ getMyStatus(job) }}</span>
            </div>
            <p class="text-sm text-slate-600 mb-2">Presupuesto: ${{ job.budget || 0 }}</p>
            
            <div v-if="getMyStatus(job) === 'Aceptado'" class="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p class="text-xs font-bold text-green-800 dark:text-green-300 mb-1">¡Felicidades! Has sido aceptado.</p>
              <p class="text-sm">Contacta al contratante: <a :href="'mailto:' + job.employer?.email" class="text-primary-600 underline font-medium">{{ job.employer?.email || 'No disponible' }}</a></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Oportunidades Cercanas -->
      <div class="glass-panel p-8 rounded-2xl">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">Oportunidades Cercanas</h2>
          <router-link to="/map" class="text-primary-500 hover:text-primary-600 font-medium text-sm">Ver mapa completo &rarr;</router-link>
        </div>
        <MapExplorer :isEmbedded="true" />
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showReviewModal" class="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-900 p-8 rounded-2xl max-w-md w-full shadow-2xl relative">
        <h2 class="text-2xl font-bold mb-2">Calificar Trabajador</h2>
        <p class="text-sm text-slate-500 mb-6">Por favor deja una reseña sobre el servicio.</p>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Calificación (Estrellas)</label>
          <select v-model="reviewForm.rating" class="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none">
            <option value="5">5 - Excelente</option>
            <option value="4">4 - Muy Bueno</option>
            <option value="3">3 - Bueno</option>
            <option value="2">2 - Regular</option>
            <option value="1">1 - Malo</option>
          </select>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">Comentario</label>
          <textarea v-model="reviewForm.comment" rows="3" placeholder="¿Cómo fue el servicio?" class="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none"></textarea>
        </div>

        <div class="flex gap-4">
          <button @click="showReviewModal = false" class="flex-1 py-3 bg-slate-200 text-slate-800 rounded-xl font-bold hover:bg-slate-300 transition-colors">Cancelar</button>
          <button @click="submitReview" :disabled="submittingReview" class="flex-1 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors">{{ submittingReview ? 'Guardando...' : 'Guardar Reseña' }}</button>
        </div>
      </div>
    </div>

    <!-- Edit Job Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-900 p-8 rounded-2xl max-w-md w-full shadow-2xl relative">
        <h2 class="text-2xl font-bold mb-4">Editar Trabajo</h2>
        
        <form @submit.prevent="submitEditJob" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Título</label>
            <input v-model="editForm.title" type="text" required class="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Descripción</label>
            <textarea v-model="editForm.description" rows="3" required class="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none"></textarea>
          </div>
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium mb-1">Categoría</label>
              <select v-model="editForm.category" required class="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none">
                <option value="Plomería">Plomería</option>
                <option value="Electricidad">Electricidad</option>
                <option value="Limpieza">Limpieza</option>
                <option value="Construcción">Construcción</option>
                <option value="Jardinería">Jardinería</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium mb-1">Presupuesto ($)</label>
              <input v-model.number="editForm.budget" type="number" class="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none">
            </div>
          </div>
          
          <div class="flex gap-4 mt-6">
            <button type="button" @click="showEditModal = false" class="flex-1 py-3 bg-slate-200 text-slate-800 rounded-xl font-bold hover:bg-slate-300 transition-colors">Cancelar</button>
            <button type="submit" :disabled="submittingEdit" class="flex-1 py-3 bg-accent-500 text-white rounded-xl font-bold hover:bg-accent-600 transition-colors">{{ submittingEdit ? 'Guardando...' : 'Actualizar' }}</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../store/auth.store';
import { useJobStore } from '../store/job.store';
import MapExplorer from './MapExplorer.vue';

const authStore = useAuthStore();
const jobStore = useJobStore();

const expandedJobId = ref(null);

// Review state
const showReviewModal = ref(false);
const jobToReview = ref(null);
const submittingReview = ref(false);
const reviewForm = ref({ rating: 5, comment: '' });

// Edit state
const showEditModal = ref(false);
const jobToEdit = ref(null);
const submittingEdit = ref(false);
const editForm = ref({ title: '', description: '', category: '', budget: 0 });

const totalBudget = computed(() => {
  return jobStore.myJobs.reduce((acc, job) => acc + (job.budget || 0), 0);
});

// Para trabajadores
const myApplications = computed(() => {
  return jobStore.myJobs;
});

const totalWorkerIncome = computed(() => {
  if (authStore.role !== 'Trabajador') return 0;
  return jobStore.myJobs.reduce((acc, job) => {
    const myApp = job.applicants?.find(a => a.user === authStore.user._id || a.user?._id === authStore.user._id);
    if (myApp && myApp.status === 'Aceptado' && job.status === 'Completado') {
      return acc + (job.budget || 0);
    }
    return acc;
  }, 0);
});

const toggleJob = (id) => {
  expandedJobId.value = expandedJobId.value === id ? null : id;
};

const acceptApplicant = async (jobId, userId) => {
  try {
    await jobStore.acceptApplicant(jobId, userId);
    alert('Trabajador aceptado exitosamente. El trabajo ahora está En Progreso.');
  } catch(e) {
    alert(e);
  }
};

// Review Flow
const openReviewModal = (job) => {
  jobToReview.value = job;
  reviewForm.value = { rating: 5, comment: '' };
  showReviewModal.value = true;
};

const submitReview = async () => {
  if(!jobToReview.value) return;
  submittingReview.value = true;
  try {
    // Si el trabajo no está completado, lo completamos primero.
    if (jobToReview.value.status !== 'Completado') {
      await jobStore.completeJob(jobToReview.value._id);
    }
    // Dejar la reseña
    await jobStore.reviewWorker(jobToReview.value._id, reviewForm.value.rating, reviewForm.value.comment);
    
    // Actualizar reviewed flag localmente para ocultar el boton
    const index = jobStore.myJobs.findIndex(j => j._id === jobToReview.value._id);
    if(index !== -1) {
      jobStore.myJobs[index].reviewed = true;
    }
    
    showReviewModal.value = false;
    alert('Trabajo completado y reseña enviada.');
  } catch(e) {
    alert(e);
  } finally {
    submittingReview.value = false;
  }
};

// Edit Flow
const openEditModal = (job) => {
  jobToEdit.value = job;
  editForm.value = {
    title: job.title,
    description: job.description,
    category: job.category,
    budget: job.budget || 0
  };
  showEditModal.value = true;
};

const submitEditJob = async () => {
  if(!jobToEdit.value) return;
  submittingEdit.value = true;
  try {
    await jobStore.editJob(jobToEdit.value._id, editForm.value);
    showEditModal.value = false;
    alert('Trabajo actualizado exitosamente.');
  } catch (e) {
    alert(e);
  } finally {
    submittingEdit.value = false;
  }
};

const getMyStatus = (job) => {
  if (!job.applicants) return 'Pendiente';
  const app = job.applicants.find(a => a.user === authStore.user._id || a.user?._id === authStore.user._id);
  return app ? app.status : 'Pendiente';
};

onMounted(async () => {
  if (authStore.role === 'Contratante') {
    await jobStore.fetchMyEmployerJobs();
  } else {
    await jobStore.fetchMyApplications();
  }
});
</script>
