import axios from "axios";

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
