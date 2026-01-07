import axios from "axios";

const api = axios.create({
  baseURL: "https://api.render.com/deploy/srv-d5f9u9k9c44c73eolib0?key=obE_FYyPros/api",
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