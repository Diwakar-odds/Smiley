import axios, { AxiosInstance } from "axios";

// Use Vite environment variable VITE_API_BASE_URL when provided, otherwise
// fall back to a relative '/api' path so browsers on different machines
// call the host serving the frontend (not their own localhost).
const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL ?? '/api';

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
