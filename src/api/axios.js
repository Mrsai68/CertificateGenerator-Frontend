import axios from 'axios';

// Backend Server Target Options
export const BACKEND_URL_OPTIONS = {
  VERCEL_PRODUCTION: 'https://backend-seven-theta-45.vercel.app',
  LOCAL_DEV: 'http://localhost:8080'
};

// Dynamically use VITE_API_BASE_URL, Vercel Production Backend URL, or Localhost Fallback
const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
  }
  return BACKEND_URL_OPTIONS.VERCEL_PRODUCTION;
};

const baseURL = getBaseURL();

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.accessToken) {
          config.headers['Authorization'] = `Bearer ${user.accessToken}`;
        }
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
