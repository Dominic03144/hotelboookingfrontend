// ✅ src/utils/axios.ts
import axios from "axios";

// Use environment variable for base URL, fallback to localhost if missing
const baseURL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL,
  withCredentials: true, // send cookies if needed
});

// Add a request interceptor to add the auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
