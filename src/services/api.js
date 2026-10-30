import axios from 'axios';
import { resolveApiBaseUrl, shouldAttachAuthToken } from './apiConfig.js';

export const API_BASE_URL = resolveApiBaseUrl(
  import.meta.env.VITE_API_URL,
  import.meta.env.PROD,
);

let memoryToken = null;

export function getStoredToken() {
  try {
    memoryToken = window.localStorage.getItem('lux-token') || null;
    return memoryToken;
  } catch {
    return memoryToken;
  }
}

export function storeAuthToken(token) {
  memoryToken = typeof token === 'string' && token ? token : null;
  try {
    if (memoryToken) window.localStorage.setItem('lux-token', memoryToken);
    else window.localStorage.removeItem('lux-token');
  } catch {
    // The in-memory token remains available for the current page session.
  }
}

export function clearAuthToken() {
  memoryToken = null;
  try {
    window.localStorage.removeItem('lux-token');
  } catch {
    // In-memory state is already cleared.
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  config.headers = config.headers || {};

  if (typeof config.headers.delete === 'function') {
    config.headers.delete('Authorization');
  } else {
    delete config.headers.Authorization;
  }

  if (token && shouldAttachAuthToken(config.url, config.baseURL || API_BASE_URL)) {
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
