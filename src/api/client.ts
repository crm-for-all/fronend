import axios from 'axios';
import i18n from '../i18n/config';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  const orgId = localStorage.getItem('crm_org_id');
  if (orgId && config.headers) {
    config.headers['X-Organization-Id'] = orgId;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('app-logout'));
    } else if (error.response?.status === 429 && (error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register'))) {
      const message = i18n.t('auth_rate_limit_error', 'You are trying to log in too fast. Please wait a minute and try again.');
      window.dispatchEvent(new CustomEvent('app-error', { detail: message }));
    } else {
      const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
      window.dispatchEvent(new CustomEvent('app-error', { detail: message }));
    }
    return Promise.reject(error);
  }
);

export default api;
