<template>
  <div class="w-full h-[calc(100vh-64px)] relative flex flex-col md:flex-row">
    <!-- Sidebar -->
    <div class="w-full md:w-96 glass border-r border-slate-200 dark:border-slate-800 z-10 flex flex-col shadow-2xl h-1/3 md:h-full relative overflow-y-auto">
      <div class="p-6">
        <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">Explorar Zona</h2>
        <p class="text-sm text-slate-500 mb-4">Mostrando alertas cerca de ti.</p>
        
        <div class="relative mb-6">
          <input type="text" placeholder="Buscar trabajos o especialistas..." class="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-500 outline-none" />
          <svg class="w-5 h-5 absolute right-3 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        <div class="space-y-4">
          <!-- Mock Item 1 -->
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-primary-500 cursor-pointer transition-colors group">
            <div class="flex justify-between items-start mb-2">
              <span class="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 text-xs font-bold rounded">URGENTE</span>
              <span class="text-xs text-slate-500">A 2.4 km</span>
            </div>
            <h4 class="font-bold text-slate-800 dark:text-white group-hover:text-primary-500 transition-colors">Fuga de Agua en Tubería Principal</h4>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">Necesito plomero urgente para reparar tubo roto en cocina. Se inunda rápido.</p>
          </div>
          
          <!-- Mock Item 2 -->
           <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-accent-500 cursor-pointer transition-colors group">
            <div class="flex justify-between items-start mb-2">
              <span class="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold rounded">Mantenimiento</span>
              <span class="text-xs text-slate-500">A 4.1 km</span>
            </div>
            <h4 class="font-bold text-slate-800 dark:text-white group-hover:text-accent-500 transition-colors">Instalación de Ventiladores</h4>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">Busco electricista para instalar 3 ventiladores de techo en departamento.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Container -->
    <div id="leaflet-map" class="flex-grow z-0 map-container relative h-2/3 md:h-full bg-slate-200 dark:bg-slate-800 w-full flex items-center justify-center">
      <div class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm pointer-events-none p-4 text-center">
        <svg class="w-16 h-16 text-primary-500 mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        <div class="glass-panel p-4 rounded-xl shadow-lg border border-primary-500/30">
          <p class="font-bold text-lg">Mapa Interactivo de Leaflet</p>
          <p class="text-sm text-slate-600 dark:text-slate-300">En una integración real de API, aquí se monta L.map() con marcadores de trabajos obtenidos desde Node.js (GeoSpatial Data)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// In a real app we'd import leaflet and configure the map onMounted.
// For this MVP, we provide a structured UI wrapper showing the intended look.
</script>

<style scoped>
.map-container {
  /* Using a mock background grid to emulate map tiles un-loaded state */
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 20px 20px;
}
:global(.dark) .map-container {
  background-image: radial-gradient(#334155 1px, transparent 1px);
}
</style>
