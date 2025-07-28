// ✅ src/utils/axios.ts
import axios from "axios";

const API = axios.create({
  baseURL: "https://hotelroombooking-jmh1.onrender.com/api", // ✅ important
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
