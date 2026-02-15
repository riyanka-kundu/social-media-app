import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Using server proxy to avoid CORS and cross site cookie issues
  server: {
    proxy: {
      "/api": {
        target: "https://social-media-api-upu9.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
