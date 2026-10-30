import { useState, useEffect } from 'react';
import { AuthContext } from './auth-context';
import { api, getStoredToken, storeAuthToken, clearAuthToken } from '../services/api';

const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [validatedToken, setValidatedToken] = useState(null);
  const loading = Boolean(token) && validatedToken !== token;

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const nextToken = response.data?.token;
      const adminData = response.data?.admin;
      if (typeof nextToken !== 'string' || !adminData?.id) {
        return { success: false, message: 'Resposta inválida da API.' };
      }

      storeAuthToken(nextToken);
      setValidatedToken(null);
      setToken(nextToken);
      setAdmin(adminData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer login',
      };
    }
  };

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const requestUrl = String(error.config?.url || '');
        const isLoginRequest = /\/auth\/login(?:[?#]|$)/.test(requestUrl);

        if ([401, 403].includes(status) && !isLoginRequest) {
          clearAuthToken();
          setToken(null);
          setValidatedToken(null);
          setAdmin(null);
        }

        return Promise.reject(error);
      },
    );

    return () => api.interceptors.response.eject(interceptorId);
  }, []);

  const logout = () => {
    clearAuthToken();
    setToken(null);
    setValidatedToken(null);
    setAdmin(null);
  };

  useEffect(() => {
    if (!token) return undefined;

    const controller = new AbortController();
    let active = true;

    api.get('/auth/me', { signal: controller.signal })
      .then((response) => {
        if (!active) return;
        setAdmin(response.data?.admin || null);
        setValidatedToken(token);
      })
      .catch((error) => {
        if (!active || error?.code === 'ERR_CANCELED') return;

        setAdmin(null);
        if ([401, 403].includes(error.response?.status)) {
          clearAuthToken();
          setToken(null);
          setValidatedToken(null);
          return;
        }

        // Keep the token through transient API/network failures, but never treat it as authenticated.
        setValidatedToken(token);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [token]);

  const value = { admin, loading, login, logout, api, isAuthenticated: !!admin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
