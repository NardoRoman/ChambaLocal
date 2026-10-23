# 🛠️ ChambaLocal — Plataforma de Conexión Laboral Georreferenciada

<p align="center">
  <img src="https://img.shields.io/badge/Stack-MEVN-42b883?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="MEVN Stack" />
  <img src="https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-Modern%20UI-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Leaflet-Geospatial-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet" />
</p>

---

## 📌 Descripción del Proyecto

**ChambaLocal** es una aplicación web progresiva y georreferenciada diseñada para conectar de forma rápida y confiable a personas que necesitan solucionar servicios urgentes u oficios técnicos (plomería, electricidad, albañilería, limpieza, jardinería, etc.) con trabajadores independientes y especialistas en su comunidad local.

A través de geolocalización en tiempo real y un mapa interactivo con cálculo de radio por proximidad, los usuarios pueden publicar ofertas de trabajo con coordenadas exactas o postularse a oportunidades cercanas, gestionando todo el ciclo de contratación, aceptación y calificación en una interfaz moderna con diseño *glassmorphism*.

---

## ✨ Características Principales

### 👥 Doble Rol Dinámico (Contratante y Trabajador)
- **Autenticación con JWT**: Registro y login unificado que permite seleccionar el rol activo en sesión.
- **Vistas y permisos contextuales**: La interfaz y las rutas de la API restringen acciones según el rol autenticado (`req.userRole`).

### 🗺️ Explorador de Trabajos Georreferenciado
- **Búsqueda por Radio de Proximidad**: Filtro dinámico en distancias de 5 km, 10 km, 20 km y 50 km utilizando indexación y consultas geoespaciales `$geoWithin` y `$centerSphere` en MongoDB.
- **Mapa interactivo con Leaflet & OpenStreetMap**: Visualización de la ubicación actual del usuario mediante geolocalización, círculo de cobertura y marcadores dinámicos por trabajo.
- **Postulación desde el Mapa**: Popups interactivos que permiten al trabajador enviar un mensaje personalizado y postularse directamente al marcador seleccionado.

### 📝 Publicación y Gestión de Trabajos
- **Selector de Ubicación en Mapa**: Al crear un trabajo, el contratante puede usar su ubicación GPS actual o mover y arrastrar el pin interactivo para fijar las coordenadas exactas de la obra o reparación.
- **Ciclo de Estados Completo**:
  - `Abierto`: Visible para postulación en el mapa.
  - `En Progreso`: Contratante aceptó a un trabajador (los demás postulantes quedan rechazados automáticamente).
  - `Completado`: Servicio finalizado con éxito.
- **Edición en tiempo real**: Los contratantes pueden actualizar título, categoría, presupuesto y descripción de trabajos abiertos.

### ⭐ Sistema de Reseñas y Reputación
- Los contratantes pueden calificar con estrellas (1 a 5) y dejar comentarios de retroalimentación al finalizar el trabajo.
- Recálculo automático del promedio de calificación (`averageRating`) del trabajador.

### 📱 Optimizado para Dispositivos Móviles y Red Local (LAN)
- Backend configurado para escuchar en `0.0.0.0` y permitir pruebas fluidas desde celulares y tablets conectadas a la misma red Wi-Fi.
- Configuración SSL para desarrollo local con `@vitejs/plugin-basic-ssl`, permitiendo que la API nativa de geolocalización de navegadores móviles (`navigator.geolocation`) opere sin restricciones de seguridad HTTPS.

---

## 🏗️ Arquitectura del Sistema

```
                  ┌─────────────────────────────────────────┐
                  │             Cliente Web                 │
                  │   Vue 3 (Composition API) + Pinia       │
                  │   Tailwind CSS + Leaflet.js             │
                  └────────────────────┬────────────────────┘
                                       │
                         HTTPS / REST API (Axios)
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │           Backend API Server            │
                  │         Node.js + Express 5             │
                  │   CORS + JWT Auth Middleware            │
                  └────────────────────┬────────────────────┘
                                       │
                         Mongoose ODM / GeoJSON
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │            Base de Datos                │
                  │       MongoDB Atlas (2dsphere index)    │
                  └─────────────────────────────────────────┘
```

---

## 💻 Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | [Vue 3](https://vuejs.org/) (SFC & `<script setup>`) | Interfaz reactiva y modular |
| **State Management** | [Pinia](https://pinia.vuejs.org/) | Gestión centralizada de estados (Auth y Jobs) |
| **Routing** | [Vue Router 4](https://router.vuejs.org/) | Enrutamiento con navegación protegida por roles |
| **Estilos** | [Tailwind CSS](https://tailwindcss.com/) | Estilos utilitarios, Glassmorphism y Dark Mode |
| **Mapas / GIS** | [Leaflet](https://leafletjs.com/) | Mapas interactivos de código abierto y geolocalización |
| **Backend** | [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) | Servidor API REST escalable |
| **Base de Datos** | [MongoDB Atlas](https://www.mongodb.com/atlas) | Base de datos NoSQL con soporte geoespacial nativo |
| **ODM** | [Mongoose](https://mongoosejs.com/) | Modelado de datos, validaciones y GeoJSON |
| **Seguridad** | [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) | Encriptación de contraseñas y autenticación por Bearer Tokens |
| **Herramientas de Build** | [Vite](https://vite.dev/) | Bundler ultrarrápido con plugin de SSL para LAN |

---

## 📁 Estructura del Proyecto

```text
ChambaLocal/
├── backend/
│   ├── src/
│   │   ├── config/             # Configuración de conexión a MongoDB
│   │   │   └── db.js
│   │   ├── controllers/        # Controladores de lógica de negocio
│   │   │   ├── auth.controller.js
│   │   │   └── job.controller.js
│   │   ├── middlewares/        # Protección de rutas con JWT
│   │   │   └── auth.middleware.js
│   │   ├── models/             # Esquemas Mongoose (GeoJSON Point & subdocumentos)
│   │   │   ├── Job.js
│   │   │   └── User.js
│   │   ├── routes/             # Endpoints REST montados
│   │   │   ├── auth.routes.js
│   │   │   └── job.routes.js
│   │   └── index.js            # Punto de entrada de Express (escucha 0.0.0.0)
│   ├── .env                    # Variables de entorno backend
│   └── package.json
│
├── frontend/
│   ├── public/                 # Archivos estáticos públicos
│   ├── src/
│   │   ├── assets/             # Imágenes y assets vectoriales
│   │   ├── components/         # Componentes reutilizables (Navbar, etc.)
│   │   ├── router/             # Definición de rutas y Guards de autenticación
│   │   ├── store/              # Stores Pinia (auth.store.js, job.store.js)
│   │   ├── utils/              # Cliente HTTP Axios configurado
│   │   ├── views/              # Vistas principales de la aplicación
│   │   │   ├── CreateJob.vue   # Publicación con mapa interactivo y selector
│   │   │   ├── Dashboard.vue   # Panel de control por rol, gestión de postulaciones y reseñas
│   │   │   ├── Home.vue        # Landing page de presentación
│   │   │   ├── Login.vue       # Acceso con selección de rol
│   │   │   ├── MapExplorer.vue # Explorador Leaflet con radio de búsqueda en km
│   │   │   └── Register.vue    # Registro de usuarios
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── .env.local              # IP local para desarrollo en red
│   ├── vite.config.js          # Configuración Vite, Proxy y Basic SSL
│   └── package.json
│
└── README.md                   # Documentación general del repositorio
```

---

## 🔌 Referencia de la API REST

### Autenticación (`/api/auth`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Público | Registro de usuario (Contratante o Trabajador) |
| `POST` | `/api/auth/login` | Público | Inicio de sesión con generación de JWT |
| `GET` | `/api/auth/me` | Privado | Información del usuario autenticado en sesión |

### Trabajos y Geoposicionamiento (`/api/jobs`)
| Método | Endpoint | Acceso / Rol | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs/nearby` | Público | Consulta trabajos abiertos dentro de un radio `distance` (km) desde `lng` y `lat` |
| `POST` | `/api/jobs` | Privado (Contratante) | Crea un nuevo trabajo con coordenadas GeoJSON |
| `PUT` | `/api/jobs/:id` | Privado (Contratante) | Edita título, categoría, descripción o presupuesto |
| `GET` | `/api/jobs/me` | Privado (Contratante) | Obtiene los trabajos creados por el contratante con lista de postulantes |
| `GET` | `/api/jobs/my-applications` | Privado (Trabajador) | Lista de trabajos a los que se ha postulado el trabajador |
| `POST` | `/api/jobs/:id/apply` | Privado (Trabajador) | Postularse a un trabajo enviando un mensaje y propuesta |
| `PUT` | `/api/jobs/:id/applicants/:userId/accept` | Privado (Contratante) | Acepta a un postulante y cambia el estado a *En Progreso* |
| `PUT` | `/api/jobs/:id/complete` | Privado (Contratante) | Finaliza el trabajo y marca como *Completado* |
| `POST` | `/api/jobs/:id/review` | Privado (Contratante) | Registra calificación y comentario hacia el trabajador |

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [MongoDB Atlas](https://www.mongodb.com/atlas) o instancia local de MongoDB
- Administrador de paquetes `npm`

---

### 1. Configuración del Backend

1. Entra en el directorio del backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea o edita el archivo `.env` en la raíz de `backend/`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=tu_cadena_de_conexion_mongodb
   JWT_SECRET=tu_clave_secreta_jwt
   ```

4. Inicia el servidor backend en modo desarrollo:
   ```bash
   npm run dev
   ```
   > El servidor se iniciará en `http://localhost:5000` (escuchando en `0.0.0.0` para acceso en red local).

---

### 2. Configuración del Frontend

1. En una nueva terminal, entra al directorio del frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. *(Opcional para pruebas en red local Wi-Fi)*:
   Verifica tu dirección IP privada local (ej. `192.168.1.XX` o `172.26.163.XX`) y crea el archivo `.env.local` dentro de `frontend/`:
   ```env
   VITE_API_BASE_URL=http://<TU_IP_LOCAL>:5000/api
   ```

4. Inicia el servidor de desarrollo Vite con soporte para red local:
   ```bash
   npm run dev -- --host
   ```

5. Abre la URL indicada en tu navegador. Si accedes desde tu teléfono conectado a la misma red Wi-Fi, ingresa a la dirección `https://<TU_IP_LOCAL>:5173`. 
   > Acepta el certificado autofirmado local para que el navegador móvil permita el uso del GPS en el mapa.

---

## 📐 Modelo de Datos Clave

### Modelo GeoJSON en Mongoose (`Job.js`)
```javascript
location: {
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitud, latitud]
    required: true
  }
}

// Índice geoespacial 2dsphere para soporte de consultas esféricas
jobSchema.index({ location: '2dsphere' });
```

---

## 🎯 Próximas Mejoras (Roadmap)
- [ ] Mensajería y chat en tiempo real entre contratante y trabajador (Socket.io).
- [ ] Integración de pasarela de pagos escrow (Stripe / Mercado Pago).
- [ ] Notificaciones push web cuando se publique un trabajo urgente en un radio menor a 2 km.
- [ ] Carga y almacenamiento en la nube de evidencias fotográficas del trabajo (Cloudinary / AWS S3).

---

## 👤 Autor
Desarrollado con dedicación por un entusiasta del desarrollo full-stack moderno.

¿Te gustó el proyecto o quieres colaborar? ¡Siéntete libre de dar una estrella ⭐ al repositorio o abrir un pull request!
