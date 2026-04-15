import { defineStore } from 'pinia';
import api from '../utils/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),
  getters: {
    role: (state) => state.user?.role,
  },
  actions: {
    async loadUser() {
      if (!this.token) return;
      this.loading = true;
      try {
        const res = await api.get('/auth/me');
        this.user = res.data.data;
        this.isAuthenticated = true;
      } catch (err) {
        this.token = null;
        localStorage.removeItem('token');
        this.isAuthenticated = false;
        this.user = null;
      } finally {
        this.loading = false;
      }
    },
    async login(email, password, role) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post('/auth/login', { email, password, role });
        this.token = res.data.token;
        this.user = res.data.user;
        this.isAuthenticated = true;
        localStorage.setItem('token', this.token);
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al iniciar sesión';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },
    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post('/auth/register', userData);
        this.token = res.data.token;
        this.user = res.data.user;
        this.isAuthenticated = true;
        localStorage.setItem('token', this.token);
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al registrarse';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  }
});
