import axios from "axios";

const api = axios.create({
  baseURL: "/",
  withCredentials: true,
});

// ← this was missing! sends token with every request
api.interceptors.request.use((config) => {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  if (userData?.token) {
    config.headers.Authorization = `Bearer ${userData.token}`;
  }
  return config;
});

export default api;