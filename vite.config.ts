import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/

export default defineConfig({
  base: "/events-app",
  server: { 
    host: '192.168.56.101',
    port: 3000,
    proxy: {
      "/api": {
        target: "http://192.168.56.101:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
    },
  },
  plugins: [react()]
});