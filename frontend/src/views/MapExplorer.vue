<template>
  <div class="w-full relative flex flex-col md:flex-row" :class="isEmbedded ? 'h-[600px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800' : 'h-[calc(100vh-64px)]'">
    <!-- Sidebar -->
    <div class="w-full md:w-96 glass border-r border-slate-200 dark:border-slate-800 z-10 flex flex-col shadow-2xl h-1/3 md:h-full relative overflow-y-auto">
      <div class="p-6">
        <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">Explorar Zona</h2>
        <p class="text-sm text-slate-500 mb-4">Mostrando alertas cerca de ti.</p>
        
        <div class="relative mb-4">
          <input type="text" v-model="searchQuery" placeholder="Buscar trabajos..." class="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-500 outline-none" />
          <svg class="w-5 h-5 absolute right-3 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        <div class="mb-6 flex gap-2">
          <select v-model="distanceFilter" @change="fetchJobs" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-500 outline-none text-sm w-1/2">
            <option :value="5">5 km</option>
            <option :value="10">10 km</option>
            <option :value="20">20 km</option>
            <option :value="50">50 km</option>
          </select>
          <select v-model="categoryFilter" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-500 outline-none text-sm w-1/2">
            <option value="">Todas</option>
            <option value="Plomería">Plomería</option>
            <option value="Electricidad">Electricidad</option>
            <option value="Limpieza">Limpieza</option>
            <option value="Construcción">Construcción</option>
            <option value="Jardinería">Jardinería</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div v-if="jobStore.loading" class="text-center py-8">
          <svg class="animate-spin mx-auto h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>

        <div v-else class="space-y-4">
          <div v-if="filteredJobs.length === 0" class="text-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500">
            No se encontraron trabajos cercanos en el radio seleccionado.
          </div>

          <div v-for="job in filteredJobs" :key="job._id" @click="focusJob(job)" class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-primary-500 cursor-pointer transition-colors group">
            <div class="flex justify-between items-start mb-2">
              <span class="px-2 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 text-xs font-bold rounded">{{ job.category }}</span>
              <span v-if="job.budget" class="text-xs font-semibold text-slate-700 dark:text-slate-300">${{ job.budget }}</span>
            </div>
            <h4 class="font-bold text-slate-800 dark:text-white group-hover:text-primary-500 transition-colors">{{ job.title }}</h4>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{{ job.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Container -->
    <div ref="mapContainer" class="flex-grow z-0 map-container relative h-2/3 md:h-full bg-slate-200 dark:bg-slate-800 w-full">
      <button @click="centerOnUser" class="absolute bottom-6 right-6 z-[1000] p-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white rounded-full shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors" title="Mi ubicación">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useJobStore } from '../store/job.store';
import { useAuthStore } from '../store/auth.store';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const jobStore = useJobStore();
const authStore = useAuthStore();

const props = defineProps({
  isEmbedded: {
    type: Boolean,
    default: false
  }
});

const searchQuery = ref('');
const categoryFilter = ref('');
const distanceFilter = ref(10); // 10 km by default

const userLat = ref(null);
const userLng = ref(null);

const mapContainer = ref(null);
let map = null;
let userMarker = null;
let radiusCircle = null;
let jobMarkers = [];

const filteredJobs = computed(() => {
  return jobStore.jobs.filter(job => {
    const matchCat = categoryFilter.value ? job.category === categoryFilter.value : true;
    const matchSearch = searchQuery.value ? (job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || job.description.toLowerCase().includes(searchQuery.value.toLowerCase())) : true;
    return matchCat && matchSearch;
  });
});

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});

const initMap = () => {
  const defaultCenter = [19.4326, -99.1332]; // CDMX default
  map = L.map(mapContainer.value).setView(defaultCenter, 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  getLocationAndFetch();
};

const getLocationAndFetch = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLat.value = position.coords.latitude;
        userLng.value = position.coords.longitude;
        updateUserLocationOnMap();
        fetchJobs();
      },
      (error) => {
        console.warn("No se pudo obtener la ubicación, usando por defecto.", error.message);
        // Usar default y fetch de todos modos
        userLat.value = 19.4326;
        userLng.value = -99.1332;
        updateUserLocationOnMap();
        fetchJobs();
      }
    );
  } else {
    // Default
    userLat.value = 19.4326;
    userLng.value = -99.1332;
    updateUserLocationOnMap();
    fetchJobs();
  }
};

const centerOnUser = () => {
  getLocationAndFetch();
};

const updateUserLocationOnMap = () => {
  if (!map) return;

  const latlng = [userLat.value, userLng.value];
  map.setView(latlng, 13);

  // Icono personalizado para el usuario
  const userIcon = L.divIcon({
    html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
    className: 'custom-user-icon',
    iconSize: [16, 16]
  });

  if (userMarker) {
    userMarker.setLatLng(latlng);
  } else {
    userMarker = L.marker(latlng, { icon: userIcon }).addTo(map)
      .bindPopup("<b>Tu ubicación</b>").openPopup();
  }

  updateRadiusCircle();
};

const updateRadiusCircle = () => {
  if (!map || !userLat.value || !userLng.value) return;

  const latlng = [userLat.value, userLng.value];
  const radiusMeters = distanceFilter.value * 1000;

  if (radiusCircle) {
    radiusCircle.setLatLng(latlng);
    radiusCircle.setRadius(radiusMeters);
  } else {
    radiusCircle = L.circle(latlng, {
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      radius: radiusMeters,
      weight: 1
    }).addTo(map);
  }
};

const fetchJobs = async () => {
  if (!userLat.value || !userLng.value) return;
  
  updateRadiusCircle();
  await jobStore.fetchNearbyJobs(userLng.value, userLat.value, distanceFilter.value);
  renderJobMarkers();
};

watch(filteredJobs, () => {
  renderJobMarkers();
});

const renderJobMarkers = () => {
  if (!map) return;

  // Clear existing markers
  jobMarkers.forEach(m => map.removeLayer(m));
  jobMarkers = [];

  // Agregar nuevos marcadores
  filteredJobs.value.forEach(job => {
    if (job.location && job.location.coordinates) {
      const [lng, lat] = job.location.coordinates;
      
      const marker = L.marker([lat, lng]).addTo(map);
      
      // Construir contenido del popup
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 min-w-[200px]';
      popupContent.innerHTML = `
        <div class="font-bold text-lg text-slate-800 mb-1">${job.title}</div>
        <div class="text-xs text-primary-600 font-semibold mb-2">${job.category}</div>
        <div class="text-sm text-slate-600 mb-3">${job.description.substring(0, 100)}...</div>
        ${job.budget ? `<div class="text-sm font-bold text-slate-800 mb-3">Presupuesto: $${job.budget}</div>` : ''}
      `;

      if (authStore.role === 'Trabajador') {
        const msgContainer = document.createElement('div');
        msgContainer.className = 'mt-2 mb-2';
        
        const msgInput = document.createElement('textarea');
        msgInput.className = 'w-full text-sm p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500';
        msgInput.placeholder = 'Escribe un mensaje corto... (ej: Cobro $200 y llego en 20 min)';
        msgInput.rows = 2;
        
        msgContainer.appendChild(msgInput);
        popupContent.appendChild(msgContainer);

        const applyBtn = document.createElement('button');
        applyBtn.className = 'w-full bg-primary-500 text-white text-xs font-bold py-2 rounded shadow hover:bg-primary-600 transition-colors mt-1';
        applyBtn.innerText = 'Postularse a este trabajo';
        applyBtn.onclick = () => applyToJobFromPopup(job._id, applyBtn, msgInput.value);
        popupContent.appendChild(applyBtn);
      }

      marker.bindPopup(popupContent);
      jobMarkers.push(marker);
    }
  });
};

const focusJob = (job) => {
  if (job.location && job.location.coordinates && map) {
    const [lng, lat] = job.location.coordinates;
    map.setView([lat, lng], 15);
    // Find marker and open popup
    const marker = jobMarkers.find(m => m.getLatLng().lat === lat && m.getLatLng().lng === lng);
    if (marker) {
      marker.openPopup();
    }
  }
};

const applyToJobFromPopup = async (jobId, btnElement, message) => {
  try {
    btnElement.innerText = 'Postulando...';
    btnElement.disabled = true;
    btnElement.classList.add('opacity-50');
    
    await jobStore.applyToJob(jobId, message);
    
    btnElement.innerText = '¡Postulado con éxito!';
    btnElement.classList.remove('bg-primary-500', 'hover:bg-primary-600');
    btnElement.classList.add('bg-green-500');
  } catch (error) {
    alert(error);
    btnElement.innerText = 'Postularse a este trabajo';
    btnElement.disabled = false;
    btnElement.classList.remove('opacity-50');
  }
};
</script>

<style scoped>
/* Asegurar que el z-index de leaflet no se sobreponga al header/navbar (z-50) */
.leaflet-container {
  z-index: 10;
}
.custom-user-icon {
  background: transparent;
  border: none;
}
</style>
