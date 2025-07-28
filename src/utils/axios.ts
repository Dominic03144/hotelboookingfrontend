// ✅ src/utils/axios.ts
import axios from "axios";

const API = axios.create({
  baseURL: "https://hotelroombooking-jmh1.onrender.com",
  withCredentials: true, // if you store JWT in cookies
});

// Attach token from localStorage automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
