import axios from "axios";

// Live Render backend URL
const API_BASE_URL = 'https://intelligent-campus-event-management-system-testing.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


const api = axios.create({
  baseURL: "/api/"
});

api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        "access"
      );

    if(token){

      config.headers.Authorization =
      `Bearer ${token}`;
    }

    return config;
  }

);

export default api;