import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/events-app", // Замените RepoName на имя вашего репозитория
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.56.101:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
    },
  },
});