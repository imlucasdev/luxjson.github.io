import axios from 'axios';
import { resolveApiBaseUrl, shouldAttachAuthToken } from './apiConfig.js';
import { getStoredToken, storeAuthToken, clearAuthToken } from './authTokenStorage.js';

const appEnv = import.meta.env || {};
export const API_BASE_URL = resolveApiBaseUrl(appEnv.VITE_API_URL, appEnv.PROD);

export { getStoredToken, storeAuthToken, clearAuthToken };

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
