import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : null;
  return config;
});

export default instance;
