// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://hotelroombooking-jmh1.onrender.com/api", // ✅ This points to your backend server
  withCredentials: true, // ✅ If you use cookies/sessions
});

export default api;
