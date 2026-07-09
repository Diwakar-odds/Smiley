import axios, { AxiosInstance } from "axios";

// Use import.meta.env directly for Vite static replacement, and hardcode the production URL as a fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smiley-food-backend.onrender.com/api';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token from localStorage on each request
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { client };
export default client;
