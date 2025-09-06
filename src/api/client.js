import axios from "axios";

// Use Vite environment variable VITE_API_BASE_URL when provided, otherwise
// fall back to a relative '/api' path so browsers on different machines
// call the host serving the frontend (not their own localhost).
const API_BASE_URL = (import.meta)?.env?.VITE_API_BASE_URL ?? '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to always send JWT token from localStorage
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
