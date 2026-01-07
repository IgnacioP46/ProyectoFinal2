import axios from "axios";

const api = axios.create({
  baseURL: "https://discosderizos.onrender.com/api",
});

// Interceptor: Antes de cada petición, inyecta el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;