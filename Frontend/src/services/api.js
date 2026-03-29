import axios from "axios";

/** Shared Axios instance used by all frontend API services. */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
});

let authHandlers = {
  getToken: () => null,
  onUnauthorized: () => {},
};

/**
 * Registers token and unauthorized callbacks used by Axios interceptors.
 * @param {{ getToken: () => string | null, onUnauthorized: () => void }} handlers
 */
export const setAuthHandlers = (handlers) => {
  authHandlers = handlers;
};

api.interceptors.request.use((config) => {
  window.dispatchEvent(new Event("app:loading:start"));
  const token = authHandlers.getToken?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    window.dispatchEvent(new Event("app:loading:end"));
    return response;
  },
  (error) => {
    window.dispatchEvent(new Event("app:loading:end"));
    if (error.response?.status === 401) {
      authHandlers.onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

/**
 * Extracts a human-readable message from API or network failures.
 * @param {unknown} error
 * @returns {string}
 */
export const extractApiError = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

export default api;
