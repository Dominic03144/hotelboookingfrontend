// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // your Vite dev server port
    proxy: {
      "/api": {
        target: "https://hotelroombooking-jmh1.onrender.com", // your Express backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
