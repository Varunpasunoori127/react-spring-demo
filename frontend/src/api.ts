import axios from 'axios';
import type { AxiosInstance, AxiosBasicCredentials } from 'axios';

export const api: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Basic auth helpers
export function setAuth(username: string, password: string) {
  api.defaults.auth = { username, password } as AxiosBasicCredentials;
}
export function clearAuth() {
  delete (api.defaults as { auth?: unknown }).auth;
}

// ---- Optional but VERY useful: log all requests/responses in DevTools Console
api.interceptors.request.use((config) => {
  const { method, url, data } = config;
  console.log('API →', method?.toUpperCase(), url, data ?? '');
  return config;
});
api.interceptors.response.use(
  (res) => {
    console.log('API ←', res.status, res.config.url, res.data ?? '');
    return res;
  },
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url;
    const data = err?.response?.data;
    console.error('API ×', status, url, data ?? err.message);
    return Promise.reject(err);
  }
);
