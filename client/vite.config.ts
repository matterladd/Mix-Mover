import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.1', 
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:3000'
    }
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  },
});
