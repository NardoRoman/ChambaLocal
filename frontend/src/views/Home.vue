<template>
  <div class="relative overflow-hidden w-full">
    <!-- Hero Section -->
    <div class="relative pt-20 pb-20 lg:pt-32 lg:pb-28">
      <!-- Decorative background elements -->
      <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute top-[20%] right-[-5%] w-80 h-80 bg-accent-400/20 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 1s;"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center animate-fade-in">
          <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Encuentra <span class="text-gradient">expertos locales</span> <br/>
            para cualquier tarea
          </h1>
          <p class="mt-4 max-w-2xl text-xl text-slate-600 dark:text-slate-300 mx-auto mb-10">
            La plataforma más confiable para conectar con plomeros, electricistas, constructores y más en tu propia comunidad. Rápidos, verificados y cerca de ti.
          </p>
          
          <div class="flex justify-center flex-col sm:flex-row gap-4 animate-slide-up" style="animation-delay: 0.2s;">
            <router-link to="/register" class="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-primary-500/40 transition-all transform hover:-translate-y-1">
              Quiero Contratar
            </router-link>
            <router-link to="/register" class="glass-panel text-slate-800 dark:text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all transform hover:-translate-y-1">
              Soy Trabajador
            </router-link>
          </div>
        </div>
        
        <!-- Stats/Features showcase glass panel -->
        <div class="mt-20 glass-panel rounded-3xl p-8 max-w-4xl mx-auto animate-slide-up" style="animation-delay: 0.4s;">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg">
            <div>
              <div class="text-4xl font-bold text-primary-500 mb-2">+500</div>
              <div class="text-slate-600 dark:text-slate-300 font-medium">Trabajadores Verificados</div>
            </div>
            <div>
              <div class="text-4xl font-bold text-accent-500 mb-2">98%</div>
              <div class="text-slate-600 dark:text-slate-300 font-medium">Clientes Satisfechos</div>
            </div>
            <div>
              <div class="text-4xl font-bold text-primary-500 mb-2">10 min</div>
              <div class="text-slate-600 dark:text-slate-300 font-medium">Respuesta Promedio</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cómo Funciona Section -->
    <section class="py-20 bg-white/50 dark:bg-slate-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-extrabold mb-4">¿Cómo funciona ChambaLocal?</h2>
          <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Conectamos necesidades urgentes con manos expertas en tres simples pasos.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div class="text-center group">
            <div class="w-20 h-20 mx-auto glass rounded-2xl flex items-center justify-center text-primary-500 mb-6 group-hover:-translate-y-2 transition-transform">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </div>
            <h3 class="text-xl font-bold mb-2">1. Publica tu necesidad</h3>
            <p class="text-slate-500 dark:text-slate-400">Describe el problema, define tu presupuesto y especifica si es una emergencia.</p>
          </div>
          <div class="text-center group">
             <div class="w-20 h-20 mx-auto glass rounded-2xl flex items-center justify-center text-accent-500 mb-6 group-hover:-translate-y-2 transition-transform">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <h3 class="text-xl font-bold mb-2">2. Encuentra al experto</h3>
            <p class="text-slate-500 dark:text-slate-400">Nuestro mapa localiza y notifica a los trabajadores certificados más cercanos a ti.</p>
          </div>
          <div class="text-center group">
             <div class="w-20 h-20 mx-auto glass rounded-2xl flex items-center justify-center text-primary-500 mb-6 group-hover:-translate-y-2 transition-transform">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 class="text-xl font-bold mb-2">3. Trabajo terminado</h3>
            <p class="text-slate-500 dark:text-slate-400">Califica el servicio y paga cómodamente. Todo de forma transparente.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Categories -->
    <section class="py-20 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-10">
          <div>
            <h2 class="text-3xl font-extrabold mb-2">Servicios Populares</h2>
            <p class="text-slate-500 dark:text-slate-400">Los oficios más solicitados esta semana en tu localidad</p>
          </div>
          <router-link to="/map" class="hidden sm:inline-flex text-primary-500 hover:text-primary-600 font-medium items-center gap-1">Ver todos <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></router-link>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="glass-panel p-6 rounded-2xl cursor-pointer hover:border-primary-500 transition-colors text-center group">
            <span class="text-4xl mb-4 block group-hover:scale-110 transition-transform">🔧</span>
            <h3 class="font-bold mb-1">Plomería</h3>
            <p class="text-xs text-slate-500">120 expertos</p>
          </div>
          <div class="glass-panel p-6 rounded-2xl cursor-pointer hover:border-accent-500 transition-colors text-center group">
            <span class="text-4xl mb-4 block group-hover:scale-110 transition-transform">⚡</span>
            <h3 class="font-bold mb-1">Electricidad</h3>
            <p class="text-xs text-slate-500">85 expertos</p>
          </div>
          <div class="glass-panel p-6 rounded-2xl cursor-pointer hover:border-primary-500 transition-colors text-center group">
            <span class="text-4xl mb-4 block group-hover:scale-110 transition-transform">🧹</span>
            <h3 class="font-bold mb-1">Limpieza</h3>
            <p class="text-xs text-slate-500">200 expertos</p>
          </div>
          <div class="glass-panel p-6 rounded-2xl cursor-pointer hover:border-accent-500 transition-colors text-center group">
            <span class="text-4xl mb-4 block group-hover:scale-110 transition-transform">🧱</span>
            <h3 class="font-bold mb-1">Albañilería</h3>
            <p class="text-xs text-slate-500">64 expertos</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action App -->
    <section class="py-20">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <h2 class="text-3xl md:text-4xl font-extrabold mb-4 relative z-10">¿Listo para solucionar ese problema en tu hogar?</h2>
          <p class="text-primary-100 text-lg max-w-2xl mx-auto mb-8 relative z-10">
            Únete a cientos de usuarios que ya confían en trabajadores locales. Registro gratuito, decisiones rápidas.
          </p>
          <router-link to="/register" class="inline-block bg-white text-primary-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-colors shadow-lg relative z-10 hover:shadow-white/20 transform hover:-translate-y-1">
            Comenzar Ahora Mismo
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
