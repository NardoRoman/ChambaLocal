import { defineStore } from 'pinia';
import api from '../utils/api';

export const useJobStore = defineStore('job', {
  state: () => ({
    jobs: [], // Trabajos cercanos (MapExplorer)
    myJobs: [], // Mis publicaciones (Contratante) o Mis postulaciones (Trabajador)
    loading: false,
    error: null,
  }),
  actions: {
    // Obtener trabajos cercanos
    async fetchNearbyJobs(lng, lat, distance = 10) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get(`/jobs/nearby?lng=${lng}&lat=${lat}&distance=${distance}`);
        this.jobs = res.data.data;
        return this.jobs;
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al obtener trabajos cercanos';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    // Crear un nuevo trabajo (Solo Contratante)
    async createJob(jobData) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post('/jobs', jobData);
        // Podríamos agregarlo a la lista local si quisieramos
        // this.jobs.unshift(res.data.data);
        return res.data.data;
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al crear el trabajo';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    // Aplicar a un trabajo (Solo Trabajador)
    async applyToJob(jobId, message) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post(`/jobs/${jobId}/apply`, { message });
        return res.data.data;
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al aplicar al trabajo';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    // Obtener mis trabajos (Solo Contratante)
    async fetchMyEmployerJobs() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get('/jobs/me');
        this.myJobs = res.data.data;
        return this.myJobs;
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al obtener tus trabajos';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    // Obtener mis postulaciones (Solo Trabajador)
    async fetchMyApplications() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get('/jobs/my-applications');
        this.myJobs = res.data.data;
        return this.myJobs;
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al obtener tus postulaciones';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    // Aceptar postulante
    async acceptApplicant(jobId, userId) {
      this.loading = true;
      try {
        const res = await api.put(`/jobs/${jobId}/applicants/${userId}/accept`);
        // Actualizamos localmente
        const index = this.myJobs.findIndex(j => j._id === jobId);
        if(index !== -1) this.myJobs[index] = res.data.data;
        return res.data.data;
      } catch (err) {
        throw err.response?.data?.error || 'Error al aceptar al trabajador';
      } finally {
        this.loading = false;
      }
    },

    // Completar trabajo
    async completeJob(jobId) {
      this.loading = true;
      try {
        const res = await api.put(`/jobs/${jobId}/complete`);
        // Actualizamos localmente
        const index = this.myJobs.findIndex(j => j._id === jobId);
        if(index !== -1) this.myJobs[index] = res.data.data;
        return res.data.data;
      } catch (err) {
        throw err.response?.data?.error || 'Error al completar el trabajo';
      } finally {
        this.loading = false;
      }
    },

    // Dejar reseña
    async reviewWorker(jobId, rating, comment) {
      this.loading = true;
      try {
        const res = await api.post(`/jobs/${jobId}/review`, { rating, comment });
        return res.data.data; // worker data
      } catch (err) {
        throw err.response?.data?.error || 'Error al enviar reseña';
      } finally {
        this.loading = false;
      }
    }
  }
});
