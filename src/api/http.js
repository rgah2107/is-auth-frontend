import axios from 'axios';

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'https://pruebareactjs.test-class.com/Api';

export function createHttpClient({ getAuthToken, onUnauthorized } = {}) {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use((config) => {
    const token = getAuthToken?.();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error?.response?.status === 401) onUnauthorized?.();
      return Promise.reject(error);
    }
  );

  return client;
}

export function getApiErrorMessage(error) {
  if (!error) return 'Hubo un inconveniente con la transacción.';
  const msg =
    error?.response?.data?.message ||
    error?.response?.data?.title ||
    (typeof error?.response?.data === 'string' ? error.response.data : null) ||
    error?.message;
  return msg || 'Hubo un inconveniente con la transacción.';
}

