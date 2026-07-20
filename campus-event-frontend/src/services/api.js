import axios from "axios";

// Live Render backend URL (falls back to local env variable if present)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://intelligent-campus-event-management-system-testing.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT access token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;