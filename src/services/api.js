import axios from 'axios';

const configuredBaseUrl = import.meta.env.VITE_API_URL;
const defaultBaseUrl = import.meta.env.PROD
  ? 'https://api.luxjson.is-a.dev/api'
  : 'http://localhost:5000/api';

export const API_BASE_URL = String(configuredBaseUrl || defaultBaseUrl)
  .trim()
  .replace(/\/+$/, '');

let memoryToken = null;

export function getStoredToken() {
  try {
    const stored = window.localStorage.getItem('lux-token');
    if (stored) {
      memoryToken = stored;
      return stored;
    }
  } catch {
    return memoryToken;
  }
  return memoryToken;
}

export function storeAuthToken(token) {
  memoryToken = typeof token === 'string' ? token : null;
  try {
    if (memoryToken) window.localStorage.setItem('lux-token', memoryToken);
    else window.localStorage.removeItem('lux-token');
  } catch {
    memoryToken = typeof token === 'string' ? token : null;
  }
}

export function clearAuthToken() {
  memoryToken = null;
  try {
    window.localStorage.removeItem('lux-token');
  } catch {
    memoryToken = null;
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
  if (token && !String(config.url || '').endsWith('/auth/login')) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});
