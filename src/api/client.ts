import axios, { AxiosInstance } from "axios";

const API_BASE_URL = "http://localhost:5000/api";

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
