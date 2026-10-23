<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in relative">
    <!-- Decorative background -->
    <div class="absolute top-10 left-10 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl -z-10"></div>
    
    <div class="mb-8">
      <router-link to="/dashboard" class="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center gap-1 mb-4">
        &larr; Volver al Dashboard
      </router-link>
      <h1 class="text-3xl font-extrabold text-slate-800 dark:text-white">Publicar Nuevo Trabajo</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-2">Completa los detalles y selecciona la ubicación exacta en el mapa.</p>
    </div>

    <div class="glass-panel p-8 rounded-2xl shadow-xl">
      <form @submit.prevent="submitJob" class="space-y-6">
        
        <!-- Error message -->
        <div v-if="errorMsg" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800">
          {{ errorMsg }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título del Trabajo</label>
              <input v-model="form.title" type="text" required placeholder="Ej: Fuga de agua en lavabo" class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-500 outline-none transition-colors" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
              <select v-model="form.category" required class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-500 outline-none transition-colors">
                <option value="" disabled>Selecciona una categoría</option>
                <option value="Plomería">🔧 Plomería</option>
                <option value="Electricidad">⚡ Electricidad</option>
                <option value="Limpieza">🧹 Limpieza</option>
                <option value="Construcción">🧱 Construcción</option>
                <option value="Jardinería">🌱 Jardinería</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Presupuesto Estimado ($)</label>
              <input v-model="form.budget" type="number" min="0" placeholder="0.00" class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-500 outline-none transition-colors" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
              <textarea v-model="form.description" required rows="4" placeholder="Describe el problema a detalle..." class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-500 outline-none transition-colors resize-none"></textarea>
            </div>
          </div>

          <div class="space-y-4 flex flex-col">
            <div class="flex justify-between items-center mb-1">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Ubicación del Trabajo</label>
              <button type="button" @click="useMyLocation" class="text-xs text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Mi ubicación actual
              </button>
            </div>
            <p class="text-xs text-slate-500 mb-2">Haz clic en el mapa o arrastra el marcador para seleccionar la ubicación exacta.</p>
            
            <!-- Map Container -->
            <div id="location-picker-map" class="w-full flex-grow rounded-xl border border-slate-300 dark:border-slate-700 z-0 min-h-[300px]"></div>

            <div class="flex gap-4 text-xs text-slate-500">
              <p>Lat: <span class="font-mono text-slate-800 dark:text-slate-200">{{ form.latitude?.toFixed(6) || '---' }}</span></p>
              <p>Lng: <span class="font-mono text-slate-800 dark:text-slate-200">{{ form.longitude?.toFixed(6) || '---' }}</span></p>
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button type="submit" :disabled="isLoading || !form.latitude" class="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-primary-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Publicar Trabajo
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useJobStore } from '../store/job.store';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons issue in Vue/Vite
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const router = useRouter();
const jobStore = useJobStore();

const form = ref({
  title: '',
  category: '',
  description: '',
  budget: null,
  latitude: null,
  longitude: null,
});

const isLoading = ref(false);
const errorMsg = ref('');

let map = null;
let marker = null;

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});

const initMap = () => {
  // Coordenadas por defecto (ej. Centro de la ciudad local, usaremos un punto general y luego intentaremos ubicar al usuario)
  // Usamos la Ciudad de México como default si no se encuentra otra cosa
  const defaultCenter = [19.4326, -99.1332];
  
  map = L.map('location-picker-map').setView(defaultCenter, 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Al hacer clic en el mapa, poner/mover el marcador
  map.on('click', (e) => {
    updateMarker(e.latlng.lat, e.latlng.lng);
  });

  // Intentar obtener la ubicación actual al cargar
  useMyLocation();
};

const updateMarker = (lat, lng) => {
  form.value.latitude = lat;
  form.value.longitude = lng;

  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    
    // Si arrastran el marcador, actualizar coordenadas
    marker.on('dragend', (event) => {
      const position = event.target.getLatLng();
      form.value.latitude = position.lat;
      form.value.longitude = position.lng;
    });
  }
};

const useMyLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        map.setView([lat, lng], 15);
        updateMarker(lat, lng);
      },
      (error) => {
        console.warn("No se pudo obtener la ubicación:", error.message);
      }
    );
  } else {
    console.warn("Geolocalización no soportada en este navegador.");
  }
};

const submitJob = async () => {
  if (!form.value.latitude || !form.value.longitude) {
    errorMsg.value = 'Por favor selecciona la ubicación del trabajo en el mapa.';
    return;
  }

  isLoading.value = true;
  errorMsg.value = '';

  try {
    await jobStore.createJob(form.value);
    router.push('/dashboard');
  } catch (error) {
    errorMsg.value = error;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Asegurar que el z-index de leaflet no se sobreponga al header/navbar (z-50) */
.leaflet-container {
  z-index: 10;
}
</style>
